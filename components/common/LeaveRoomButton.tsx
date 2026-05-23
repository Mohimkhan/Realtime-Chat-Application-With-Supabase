"use client";

import { ComponentPropsWithoutRef } from "react";
import { ActionButton } from "../ui/action-button";
import { leaveRoomAction } from "@/app/actions/rooms";
import { toast } from "react-toastify";

export function LeaveRoomButton({
  roomId,
  children,
  onSuccess,
  ...props
}: Omit<ComponentPropsWithoutRef<typeof ActionButton>, "action"> & {
  roomId: string;
  onSuccess?: () => void;
}) {
  const leaveRoom = async () => {
    const result = await leaveRoomAction(roomId);

    if (result.error) {
      return { error: true, message: result.message };
    }

    toast.success("Room left successfully");
    onSuccess?.();

    return { error: false, message: result.message };
  };

  return (
    <ActionButton {...props} action={leaveRoom}>
      {children}
    </ActionButton>
  );
}
