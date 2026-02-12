"use client";

import { ComponentPropsWithoutRef } from "react";
import { ActionButton } from "../ui/action-button";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

export function LeaveRoomButton({
  roomId,
  children,
  ...props
}: Omit<ComponentPropsWithoutRef<typeof ActionButton>, "action"> & {
  roomId: string;
}) {
  const router = useRouter();

  const leaveRoom = async () => {
    const supabase = createBrowserSupabaseClient;

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { error: true, message: "User not logged In" };
    }

    const { error } = await supabase
      .from("chat_room_member")
      .delete()
      .eq("chat_room_id", roomId)
      .eq("member_id", user.id);

    if (error) {
      return { error: true, message: "Failed to leave room" };
    }

    toast.success("Room left successfully");

    router.refresh();
    router.push("/");

    return { error: false, message: "Room left successfully" };
  };

  return (
    <ActionButton
      {...props}
      action={leaveRoom}
    >
      {children}
    </ActionButton>
  );
}
