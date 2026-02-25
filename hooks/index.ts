import { useState, useEffect, useContext, ReactNode } from "react";
import { AuthContext } from "../contexts";
import { createPortal } from "react-dom";
import { User } from "@supabase/supabase-js";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import { Message } from "@/app/actions/message";

interface PortalProps {
  children: ReactNode;
}

export const useLocalStorage = <T>(
  key: string = "value",
  initialValue: T = [] as T,
) => {
  // utility to check if a value can be parsed as JSON
  const isJsonParsable = (value: string): boolean => {
    try {
      JSON.parse(value);
      return true;
    } catch {
      return false;
    }
  };
  // check if it client or not
  const isClient: boolean = typeof window === "undefined";
  // retrieve the stored value from localStorage
  const storedValue = isClient ? localStorage.getItem(key) : null;
  // initialize the state with the stored value or the initial value
  const [value, setValue] = useState(
    storedValue !== null
      ? isJsonParsable(storedValue)
        ? JSON.parse(storedValue)
        : storedValue
      : initialValue,
  );

  // update the localStorage whenever the value changes
  useEffect(() => {
    if (isClient) {
      localStorage.setItem(
        key,
        typeof value === "object" ? JSON.stringify(value) : value,
      );
    }
  }, [key, value, isClient]);

  // function to update the value in localStorage and state
  const updateValue = <T>(newValue: T) => {
    setValue(newValue);
  };

  return [value, updateValue];
};

export const useAuth = () => {
  const { auth, setAuth } = useContext(AuthContext);

  return { auth, setAuth };
};

export const useDebounce = <T>(value: T, delay: number = 500): T => {
  const [debounceValue, setDebounceValue] = useState<T>(value);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebounceValue(value);
    }, delay);

    return () => clearTimeout(timeout);
  }, [value, delay]);

  return debounceValue;
};

export const usePortal = (domNode?: HTMLElement | null) => {
  const portalRoot =
    domNode || (document.getElementById("portal-root") as HTMLElement);

  if (!portalRoot) {
    throw new Error(
      "Portal root element not found. Ensure it exists in your HTML.",
    );
  }

  // Define the Portal component
  const Portal = ({ children }: PortalProps) => {
    return createPortal(children, portalRoot);
  };

  return { Portal };
};

export const useCurrentUser = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const supabase = createBrowserSupabaseClient;

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error && error?.message) {
        setError(error.message);
        setIsLoading(false);
        return;
      }

      setUser(user);
      setIsLoading(false);
    };

    getUser();

    const { data } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      data.subscription.unsubscribe();
    };
  }, []);

  return { user, isLoading, error };
};

export const useRealTimeChat = ({
  roomId,
  userId,
}: {
  roomId: string;
  userId: string;
}) => {
  const [connectedUsers, setConnectedUsers] = useState<number>(1);
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    const supabase = createBrowserSupabaseClient;

    const channel = supabase.channel(`room:${roomId}:messages`, {
      config: {
        private: true,
        presence: {
          key: userId,
        },
      },
    });

    channel
      .on("presence", { event: "sync" }, () => {
        const state = channel.presenceState();
        setConnectedUsers(Object?.keys(state)?.length || 1);
      })
      .on("broadcast", { event: "INSERT" }, (payload: any) => {
        const record = payload.payload.record;

        setMessages((prevMessages) => [
          ...prevMessages,
          {
            id: record.id,
            text: record.text,
            created_at: record.created_at,
            author_id: record.author_id,
            author: {
              name: record.author_name,
              image_url: record.author_image_url,
            },
          },
        ]);
      })
      .subscribe((status) => {
        if (status !== "SUBSCRIBED") return;

        channel.track({ userId });
      });

    return () => {
      channel.untrack();
      channel.unsubscribe();
    };
  }, [roomId, userId]);

  return { connectedUsers, messages };
};
