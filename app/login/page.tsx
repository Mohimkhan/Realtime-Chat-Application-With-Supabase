"use client";

import { supabase } from "@/lib/supabase/client";
import Link from "next/link";
import { useState } from "react";
import { toast } from "react-toastify";

export default function Login() {
  const [loading, setLoading] = useState<boolean>(false);

  const handleLogin = async () => {
    setLoading(true);
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

    if (error) {
      toast.error(error.message);
      setLoading(false);
      return;
    }

    setLoading(false);
  };

  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="bg-black border-[1px] px-4 py-2 border-white/50 w-[450px] h-[200px] rounded-lg flex flex-col items-stretch gap-2 justify-center">
        <h1 className="text-2xl">Welcome!</h1>
        <p className="text-sm">Sign in to your account to continue</p>
        <button
          className="mt-2 bg-white font-bold text-black p-2 rounded-md"
          onClick={handleLogin}
        >
          Login with google {loading && "..."}
        </button>

        <p className="text-white flex items-center mt-2">
          Don't have an account?{" "}
          <Link
            className="ml-1 underline underline-offset-2"
            href="/register"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
