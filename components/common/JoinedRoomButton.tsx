"use client";

import { ComponentPropsWithoutRef } from "react";
import { ActionButton } from "../ui/action-button";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

export function JoinedRoomButton({
  roomId,
  children,
  ...props
}: Omit<ComponentPropsWithoutRef<typeof ActionButton>, "action"> & {
  roomId: string;
}) {
  const router = useRouter();

  const joinRoom = async () => {
    const supabase = createBrowserSupabaseClient;

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { error: true, message: "User not logged In" };
    }

    const { error } = await supabase.from("chat_room_member").insert({
      chat_room_id: roomId,
      member_id: user.id,
    });

    if (error) {
      return { error: true, message: "Failed to join room" };
    }

    toast.success("Room joined successfully");

    router.refresh();
    router.push(`/room/${roomId}`);

    return { error: false, message: "Room joined successfully" };
  };

  return (
    <ActionButton
      {...props}
      action={joinRoom}
    >
      {children}
    </ActionButton>
  );
}
