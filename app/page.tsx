"use client";

import { useEffect } from "react";
import { toast } from "react-toastify";

export default function Home() {
  useEffect(() => {
    toast.success("Welcome to Next Template");
  }, []);
  return <div>Your Next Template</div>;
}
