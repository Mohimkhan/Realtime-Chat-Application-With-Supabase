"use client";

import { ComponentPropsWithoutRef } from "react";
import { ActionButton } from "../ui/action-button";
import { joinRoomAction } from "@/app/actions/rooms";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

export function JoinedRoomButton({
  roomId,
  children,
  onSuccess,
  ...props
}: Omit<ComponentPropsWithoutRef<typeof ActionButton>, "action"> & {
  roomId: string;
  onSuccess?: () => void;
}) {
  const router = useRouter();

  const joinRoom = async () => {
    const result = await joinRoomAction(roomId);

    if (result.error) {
      return { error: true, message: result.message };
    }

    toast.success("Room joined successfully");
    onSuccess?.();
    router.push(`/rooms/${roomId}`);

    return { error: false, message: result.message };
  };

  return (
    <ActionButton {...props} action={joinRoom}>
      {children}
    </ActionButton>
  );
}
