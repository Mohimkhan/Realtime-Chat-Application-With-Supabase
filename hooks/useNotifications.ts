import { useEffect, useState } from "react";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import { useCurrentUser } from "./index";
import { fetchNotifications } from "@/app/actions/notifications";

export type NotificationType = {
  id: string;
  created_at: string;
  type: string;
  sender_id: string;
  receiver_id: string;
  message: string;
  is_read: boolean;
  link: string | null;
  metadata: any;
  sender?: {
    id: string;
    name: string;
    image_url: string;
    email: string;
  };
};

export const useNotifications = () => {
  const { user } = useCurrentUser();
  const [notifications, setNotifications] = useState<NotificationType[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!user) return;

    const loadInitialNotifications = async () => {
      const { data, error } = await fetchNotifications();
      if (!error && data) {
        setNotifications(data as NotificationType[]);
        setUnreadCount(data.filter((n) => !n.is_read).length);
      }
    };

    loadInitialNotifications();

    const supabase = createBrowserSupabaseClient;

    const channel = supabase
      .channel("custom-all-channel")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "notifications",
          filter: `receiver_id=eq.${user.id}`,
        },
        async (payload) => {
          if (payload.eventType === "INSERT") {
            const newNotif = payload.new as NotificationType;
            
            // Fetch sender details
            const { data: senderData } = await supabase
              .from("user_profiles")
              .select("id, name, image_url, email")
              .eq("id", newNotif.sender_id)
              .maybeSingle();

            if (senderData) {
              newNotif.sender = senderData;
            }

            setNotifications((prev) => [newNotif, ...prev]);
            setUnreadCount((prev) => prev + 1);
          } else if (payload.eventType === "UPDATE") {
            const updatedNotif = payload.new as NotificationType;
            setNotifications((prev) =>
              prev.map((n) => (n.id === updatedNotif.id ? { ...n, ...updatedNotif } : n))
            );
            // Recalculate unread count
            setNotifications((prev) => {
              const newCount = prev.filter((n) => !n.is_read).length;
              setUnreadCount(newCount);
              return prev;
            });
          } else if (payload.eventType === "DELETE") {
            setNotifications((prev) => prev.filter((n) => n.id !== payload.old.id));
            setNotifications((prev) => {
              const newCount = prev.filter((n) => !n.is_read).length;
              setUnreadCount(newCount);
              return prev;
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
  };

  return { notifications, unreadCount, markAsRead };
};
