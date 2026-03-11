"use server";

import { createServerSupabaseAdminClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/utils/user";

export type Message = {
  id: string;
  text: string;
  created_at: string;
  author_id: string;
  image_url?: string;
  status?: "sending" | "error" | "image-uploading" | "image-error";
  author: {
    name: string;
    image_url: string;
  };
};

export const sendMessage = async (
  text: string,
  roomId: string,
  imageSrc?: string,
  messageId?: string,
): Promise<
  { error: false; message: Message } | { error: true; message: string }
> => {
  const user = await getCurrentUser();

  if (!user) {
    return { error: true, message: "User not authenticated" };
  }

  const supabase = await createServerSupabaseAdminClient();

  const { data: memberData, error: memberError } = await supabase
    .from("chat_room_member")
    .select("member_id")
    .eq("chat_room_id", roomId)
    .eq("member_id", user?.id)
    .single();

  if (memberError || !memberData) {
    return { error: true, message: "User is not a member of this room" };
  }

  const { data: messageData, error: messageError } = await supabase
    .from("messages")
    .insert({
      id: messageId ?? undefined,
      chat_room_id: roomId,
      text: text ?? null,
      author_id: user?.id,
      image_url: imageSrc ?? null,
    })
    .select(
      "id, text, image_url, created_at, author_id, author:user_profiles(*)",
    )
    .single();

  if (messageError) {
    return {
      error: true,
      message: "Failed to send message",
    };
  }

  return {
    error: false,
    message: {
      ...messageData,
      author: Array.isArray(messageData.author)
        ? messageData.author[0]
        : messageData.author,
    },
  };
};
