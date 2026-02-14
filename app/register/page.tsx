"use client";

import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import { useState } from "react";
import { toast } from "react-toastify";
import Link from "next/link";

export default function Register() {
  const supabase = createBrowserSupabaseClient;
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
      <div className="dark:bg-black bg-gray-100 border-[1px] px-4 py-2 border-white/50 w-[450px] h-[200px] rounded-lg flex flex-col items-stretch gap-2 justify-center">
        <h1 className="dark:text-white text-black text-2xl">Welcome!</h1>
        <p className="dark:text-white text-black text-sm">
          Sign Up to your account to continue
        </p>
        <button
          className="mt-2 bg-white font-bold text-black p-2 rounded-md"
          onClick={handleLogin}
        >
          Register with google {loading && "..."}
        </button>

        <p className="dark:text-white text-black flex items-center mt-2">
          Already have an account?{" "}
          <Link
            className="ml-1 underline underline-offset-2"
            href="/login"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
