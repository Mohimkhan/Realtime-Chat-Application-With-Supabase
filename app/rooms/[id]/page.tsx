import RoomClient from "@/components/RoomClient";
import { createServerSupabaseAdminClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/utils/user";
import { redirect } from "next/navigation";

const getRoom = async (id: string) => {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const supabase = await createServerSupabaseAdminClient();

  const { data: room, error } = await supabase
    .from("chat_rooms")
    .select("id, name, chat_room_member!inner ()")
    .eq("id", id)
    .eq("chat_room_member.member_id", user.id)
    .single();

  if (error) {
    throw new Error("Failed to fetched room");
  }

  return room;
};

const getUser = async () => {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const supabase = await createServerSupabaseAdminClient();

  const { data: userData, error } = await supabase
    .from("user_profiles")
    .select("id, name, image_url")
    .eq("id", user.id)
    .single();

  if (error) {
    throw new Error("Failed to fetched user");
  }

  return userData;
};

const getMessages = async (roomId: string) => {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const supabase = await createServerSupabaseAdminClient();

  const { data: messages, error } = await supabase
    .from("messages")
    .select(
      "id, text, created_at, author_id, author:user_profiles(name, image_url)",
    )
    .eq("chat_room_id", roomId)
    .order("created_at", { ascending: true })
    .limit(100);

  if (error) {
    return [];
  }

  return messages.map((message) => {
    return {
      ...message,
      author: Array.isArray(message.author)
        ? message.author[0]
        : message.author,
    };
  });
};

export default async function RoomPage({
  params: { id },
}: {
  params: { id: string };
}) {
  const [room, user, messages] = await Promise.all([
    getRoom(id),
    getUser(),
    getMessages(id),
  ]);

  if (!room || !user) {
    redirect("/");
  }

  return (
    <RoomClient
      room={room}
      user={user}
      messages={messages}
    ></RoomClient>
  );
}
