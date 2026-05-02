"use client";
import Hero from "@/components/home/Hero";
import { useCurrentUser } from "@/hooks";

export default function Home() {
  const { user } = useCurrentUser();

  return (
    <div className="flex-1 flex flex-col">
      <Hero user={user} />
    </div>
  );
}
