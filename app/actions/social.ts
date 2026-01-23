import { authClient } from "@/lib/auth-client";
import { toast } from "react-toastify";

export const handleGoogleLogin = async () => {
  await authClient.signIn.social({
    provider: "google",
    callbackURL: "/",
    fetchOptions: {
      onSuccess: () => {
        toast.success(`Successfully Logged In with Google`);
      },
      onError: () => {
        toast.error(`Failed to Log In with Google`);
      },
    },
  });
};

export const handleGithubLogin = async () => {
  await authClient.signIn.social({
    provider: "github",
    callbackURL: "/",
    fetchOptions: {
      onSuccess: () => {
        toast.success(`Successfully Logged In with Github`);
      },
      onError: () => {
        toast.error(`Failed to Log In with Github`);
      },
    },
  });
};
