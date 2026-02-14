import { JoinedRoomButton } from "@/components/common/JoinedRoomButton";
import { LeaveRoomButton } from "@/components/common/LeaveRoomButton";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { createServerSupabaseAdminClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/utils/user";
import { MessageSquareIcon } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { toast } from "react-toastify";

const getPublicRooms = async () => {
  const supabase = await createServerSupabaseAdminClient();

  const { data: rooms, error } = await supabase
    .from("chat_rooms")
    .select("id, name, chat_room_member (count)")
    .eq("is_public", true)
    .order("name", { ascending: true });

  if (error) {
    toast.error("Failed to fetch public rooms");
    return [];
  }

  return rooms.map((room) => ({
    id: room.id,
    name: room.name,
    memberCount: room.chat_room_member[0]?.count,
  }));
};

const getJoinedRooms = async (userId: string) => {
  const supabase = await createServerSupabaseAdminClient();

  const { data: rooms, error } = await supabase
    .from("chat_rooms")
    .select("id, name, chat_room_member (member_id)")
    .eq("is_public", true)
    .order("name", { ascending: true });

  if (error) {
    toast.error("Failed to fetch joined rooms");
    return [];
  }

  return rooms
    .filter((room) =>
      room.chat_room_member.some((member) => member.member_id === userId),
    )
    .map((room) => ({
      id: room.id,
      name: room.name,
      memberCount: room.chat_room_member.length,
    }));
};

function RoomCard({
  id,
  name,
  memberCount,
  isJoined,
  className,
}: {
  id: string;
  name: string;
  memberCount: number;
  isJoined?: boolean;
  className?: string; // add className prop
}) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{name}</CardTitle>
        <CardDescription>
          {memberCount} {memberCount === 1 ? "Member" : "Members"}
        </CardDescription>
      </CardHeader>
      <CardFooter className="gap-2">
        {isJoined ? (
          <>
            <Button
              asChild
              size="sm"
            >
              <Link href={`/rooms/${id}`}>Enter Room</Link>
            </Button>
            <LeaveRoomButton
              roomId={id}
              variant="destructive"
              size="sm"
            >
              Leave
            </LeaveRoomButton>
          </>
        ) : (
          <JoinedRoomButton
            roomId={id}
            size="sm"
            variant="outline"
          >
            Join
          </JoinedRoomButton>
        )}
      </CardFooter>
    </Card>
  );
}

function RoomList({
  title,
  rooms,
  isJoined,
}: {
  title: string;
  rooms: { id: string; name: string; memberCount: number }[];
  isJoined?: boolean;
}) {
  if (rooms.length === 0) return null;

  return (
    <div className="flex flex-col justify-center gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl">{title}</h2>
        <Button asChild>
          <Link href="/rooms/new">Create Room</Link>
        </Button>
      </div>

      <div
        style={{ scrollbarWidth: "thin" }}
        className="grid gap-4 grid-cols-[repeat(auto-fill,minmax(250px,1fr))] max-h-[300px] overflow-y-auto snap-y snap-proximity snap-always overflow-x-hidden"
      >
        {rooms.map((room) => (
          <RoomCard
            {...room}
            isJoined={isJoined}
            key={room.id}
            className="snap-start"
          />
        ))}
      </div>
    </div>
  );
}

export default async function Home() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const [publicRooms, joinedRooms] = await Promise.all([
    getPublicRooms(),
    getJoinedRooms(user.id),
  ]);

  return (
    <div className="flex-1 flex flex-col gap-4 mt-16">
      {publicRooms.length === 0 && joinedRooms.length === 0 ? (
        <Empty className="border-[1px] border-white/50 border-dashed">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <MessageSquareIcon className="size-10" />
            </EmptyMedia>
            <EmptyTitle>No Chat Rooms Yet</EmptyTitle>
            <EmptyDescription>
              Create a new chat room to get started
            </EmptyDescription>
            <EmptyContent>
              <Button asChild>
                <Link href="/rooms/new">Create Room</Link>
              </Button>
            </EmptyContent>
          </EmptyHeader>
        </Empty>
      ) : (
        <div className="flex flex-col gap-4 lg:gap-20">
          <RoomList
            title="Your Rooms"
            rooms={joinedRooms}
            isJoined
          ></RoomList>
          <RoomList
            title="Public Rooms"
            rooms={publicRooms.filter(
              (room) => !joinedRooms.some((r) => r.id === room.id),
            )}
          ></RoomList>
        </div>
      )}
    </div>
  );
}
