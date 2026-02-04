"use client";

import { supabase } from "@/lib/supabase/client";
import { useEffect, useState } from "react";

export default function Home() {
  const [email, setEmail] = useState<string>("");

  useEffect(() => {
    const newView = async () => {
      const { data, error } = await supabase.auth.getUser();

      if (data?.user) {
        setEmail(data.user.email!);
      }

      console.log({ email: data?.user?.email, error });
    };
    newView();
  }, []);

  return <div>Your Next Template {email}</div>;
}
