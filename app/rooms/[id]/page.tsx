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


export default async function RoomPage({
  params: { id },
}: {
  params: { id: string };
}) {
  const [room, user] = await Promise.all([getRoom(id), getUser()]);

  if (!room) {
    redirect("/");
  }

  return (
    <div>
      <h1>
        Room Page {room.name} {user.name}
      </h1>
    </div>
  );
}
