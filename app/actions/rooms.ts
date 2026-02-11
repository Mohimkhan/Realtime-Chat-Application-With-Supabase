"use server";

import { createRoomSchema } from "@/lib/schemas";
import { createServerSupabaseAdminClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/utils/user";
import { redirect } from "next/navigation";
import { z } from "zod";

export async function createRoom(data: z.infer<typeof createRoomSchema>) {
  const { success, error } = createRoomSchema.safeParse(data);

  if (!success) {
    return { error: true, message: "Invalid Room Data" };
  }

  const user = await getCurrentUser();

  if (!user) {
    return { error: true, message: "User not found" };
  }

  const supabase = await createServerSupabaseAdminClient();

  const { data: room, error: roomError } = await supabase
    .from("chat_rooms")
    .insert({
      name: data.name,
      is_public: data.isPublic,
    })
    .select("id")
    .single();

  if (roomError) {
    return { error: true, message: "Failed to create room" };
  }

  const { error: memberError } = await supabase
    .from("chat_room_member")
    .insert({
      chat_room_id: room.id,
      member_id: user.id,
    })
    .select("*")
    .single();

  if (memberError) {
    return { error: true, message: "Failed to enter room as member" };
  }

  redirect(`/room/${room.id}`);
}
