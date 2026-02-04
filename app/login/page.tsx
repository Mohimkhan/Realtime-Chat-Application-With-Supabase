"use client";

import { supabase } from "@/lib/supabase/client";

export default function Login() {
  const handleLogin = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `http://localhost:3000/auth/callback`,
        queryParams: {
          access_type: "offline",
          prompt: "consent",
        },
      },
    });

    console.log({ data, error });
  };

  return (
    <div>
      <button
        className="bg-yellow-400 text-white p-2 rounded"
        onClick={handleLogin}
      >
        Login with google
      </button>
    </div>
  );
}
