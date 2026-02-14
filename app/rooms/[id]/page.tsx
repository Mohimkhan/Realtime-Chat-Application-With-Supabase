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
    console.log(error);
    throw new Error("Failed to fetched room");
  }

  return room;
};

export default async function RoomPage({
  params: { id },
}: {
  params: { id: string };
}) {
  const room = await getRoom(id);

  if (!room) {
    redirect("/");
  }

  return (
    <div>
      <h1>Room Page {room.name}</h1>
    </div>
  );
}
