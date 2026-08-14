"use server";

import { createServerSupabaseAdminClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/utils/user";

export async function fetchNotifications() {
  const user = await getCurrentUser();

  if (!user) {
    return { error: true, message: "User not found" };
  }

  const supabase = await createServerSupabaseAdminClient();

  const { data: notifications, error } = await supabase
    .from("notifications")
    .select(`
      *,
      sender:sender_id(id, name, image_url, email)
    `)
    .eq("receiver_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching notifications:", error);
    return { error: true, message: "Failed to fetch notifications" };
  }

  return { error: false, data: notifications };
}

export async function markNotificationAsRead(notificationId: string) {
  const user = await getCurrentUser();

  if (!user) {
    return { error: true, message: "User not found" };
  }

  const supabase = await createServerSupabaseAdminClient();

  const { error } = await supabase
    .from("notifications")
    .update({ is_read: true })
    .eq("id", notificationId)
    .eq("receiver_id", user.id);

  if (error) {
    console.error("Error marking notification as read:", error);
    return { error: true, message: "Failed to mark as read" };
  }

  return { error: false, message: "Success" };
}

export async function markAllNotificationsAsRead() {
  const user = await getCurrentUser();

  if (!user) {
    return { error: true, message: "User not found" };
  }

  const supabase = await createServerSupabaseAdminClient();

  const { error } = await supabase
    .from("notifications")
    .update({ is_read: true })
    .eq("receiver_id", user.id)
    .eq("is_read", false);

  if (error) {
    console.error("Error marking all notifications as read:", error);
    return { error: true, message: "Failed to mark all as read" };
  }

  return { error: false, message: "Success" };
}

export async function createInviteNotification(receiverId: string, roomId: string, message: string) {
  const user = await getCurrentUser();

  if (!user) {
    return { error: true, message: "User not found" };
  }

  const supabase = await createServerSupabaseAdminClient();

  // Determine room details for metadata
  const { data: room, error: roomError } = await supabase
    .from("chat_rooms")
    .select("id, name, is_public, chat_room_member(count)")
    .eq("id", roomId)
    .maybeSingle();

  if (roomError || !room) {
    return { error: true, message: "Room not found" };
  }

  const memberCount = (room.chat_room_member[0] as { count: number })?.count ?? 0;

  const { error } = await supabase.from("notifications").insert({
    type: "invite",
    sender_id: user.id,
    receiver_id: receiverId,
    message,
    metadata: {
      roomId: room.id,
      roomName: room.name,
      isPublic: room.is_public,
      memberCount,
    },
  });

  if (error) {
    console.error("Error creating notification:", error);
    return { error: true, message: "Failed to create notification" };
  }

  return { error: false, message: "Success" };
}

export async function clearReadNotifications() {
  const user = await getCurrentUser();

  if (!user) {
    return { error: true, message: "User not found" };
  }

  const supabase = await createServerSupabaseAdminClient();

  const { error } = await supabase
    .from("notifications")
    .delete()
    .eq("receiver_id", user.id)
    .eq("is_read", true);

  if (error) {
    console.error("Error clearing read notifications:", error);
    return { error: true, message: "Failed to clear notifications" };
  }

  return { error: false, message: "Success" };
}
