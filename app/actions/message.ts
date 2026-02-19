"use server";

import { createServerSupabaseAdminClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/utils/user";

export type Message = {
  id: string;
  text: string;
  created_at: string;
  author_id: string;
  author: {
    name: string;
    image_url: string;
  };
};

export const sendMessage = async (
  text: string,
  roomId: string,
): Promise<
  { error: false; message: Message } | { error: true; message: string }
> => {
  const user = await getCurrentUser();

  if (!user) {
    return { error: true, message: "User not authenticated" };
  }

  if (!text.trim()) {
    return { error: true, message: "Message cannot be empty" };
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
      chat_room_id: roomId,
      text,
      author_id: user?.id,
    })
    .select("id, text, created_at, author_id, author:user_profiles(*)")
    .single();

  if (messageError) {
    return {
      error: true,
      message: "Failed to send message",
    };
  }

  return {
    error: false,
    message: { ...messageData, author: messageData.author[0] },
  };
};
