"use client";

import { useEffect, useState, useCallback } from "react";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import {
  getPublicRoomsAction,
  getJoinedRoomsAction,
  type PublicRoom,
} from "@/app/actions/rooms";
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
import { MessageSquareIcon } from "lucide-react";
import Link from "next/link";

function RoomCardSkeleton() {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 dark:bg-white/5 p-4 animate-pulse">
      <div className="h-5 w-2/3 rounded-md bg-white/10 mb-2" />
      <div className="h-3 w-1/3 rounded-md bg-white/10 mb-6" />
      <div className="flex gap-2">
        <div className="h-8 w-20 rounded-md bg-white/10" />
        <div className="h-8 w-16 rounded-md bg-white/10" />
      </div>
    </div>
  );
}

function RoomListSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="h-7 w-36 rounded-md bg-white/10 animate-pulse" />
        <div className="h-9 w-28 rounded-md bg-white/10 animate-pulse" />
      </div>
      <div className="grid gap-4 grid-cols-[repeat(auto-fill,minmax(250px,1fr))]">
        {Array.from({ length: 4 }).map((_, i) => (
          <RoomCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

function RoomCard({
  id,
  name,
  memberCount,
  isJoined,
  className,
  onLeave,
  onJoin,
}: {
  id: string;
  name: string;
  memberCount: number;
  isJoined?: boolean;
  className?: string;
  onLeave?: () => void;
  onJoin?: () => void;
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
            <Button asChild size="sm">
              <Link href={`/rooms/${id}`}>Enter Room</Link>
            </Button>
            <LeaveRoomButton
              roomId={id}
              variant="destructive"
              size="sm"
              onSuccess={onLeave}
            >
              Leave
            </LeaveRoomButton>
          </>
        ) : (
          <JoinedRoomButton
            roomId={id}
            disabled={memberCount >= 50}
            size="sm"
            variant="outline"
            onSuccess={onJoin}
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
  onLeave,
  onJoin,
}: {
  title: string;
  rooms: PublicRoom[];
  isJoined?: boolean;
  onLeave?: (roomId: string) => void;
  onJoin?: (roomId: string) => void;
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
        className="grid gap-4 grid-cols-[repeat(auto-fill,minmax(250px,1fr))] max-h-[312px] overflow-y-auto snap-y snap-proximity snap-always overflow-x-hidden"
      >
        {rooms.map((room) => (
          <RoomCard
            {...room}
            isJoined={isJoined}
            key={room.id}
            className="snap-start"
            onLeave={onLeave ? () => onLeave(room.id) : undefined}
            onJoin={onJoin ? () => onJoin(room.id) : undefined}
          />
        ))}
      </div>
    </div>
  );
}

export default function RoomsClient({ userId }: { userId: string }) {
  const [publicRooms, setPublicRooms] = useState<PublicRoom[]>([]);
  const [joinedRooms, setJoinedRooms] = useState<PublicRoom[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchRooms = useCallback(async () => {
    const [pub, joined] = await Promise.all([
      getPublicRoomsAction(),
      getJoinedRoomsAction(),
    ]);
    setPublicRooms(pub);
    setJoinedRooms(joined);
    setIsLoading(false);
  }, []);

  // Optimistic leave — instantly removes the room from joinedRooms,
  // then re-fetches in the background to sync member counts
  const handleLeave = useCallback(
    (roomId: string) => {
      setJoinedRooms((prev) => prev.filter((r) => r.id !== roomId));
      fetchRooms();
    },
    [fetchRooms],
  );

  // Optimistic join — instantly moves the room to joinedRooms,
  // then re-fetches to get accurate member count from the server
  const handleJoin = useCallback(
    (roomId: string) => {
      const room = publicRooms.find((r) => r.id === roomId);
      if (room) {
        setJoinedRooms((prev) => [...prev, { ...room, memberCount: room.memberCount + 1 }]);
      }
      fetchRooms();
    },
    [fetchRooms, publicRooms],
  );

  // Initial fetch
  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  // Supabase Realtime — watch chat_room_member for any INSERT or DELETE
  useEffect(() => {
    const supabase = createBrowserSupabaseClient;

    const channel = supabase
      .channel("rooms-page-members")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "chat_room_member",
        },
        () => {
          // Any membership change → re-fetch both lists
          fetchRooms();
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchRooms]);

  // Re-fetch when the auth session changes (new login, logout, etc.)
  useEffect(() => {
    const supabase = createBrowserSupabaseClient;

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event) => {
        if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
          fetchRooms();
        }
      },
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [fetchRooms]);

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col gap-4 mt-16">
        <div className="flex flex-col gap-4 lg:gap-20">
          <RoomListSkeleton />
          <RoomListSkeleton />
        </div>
      </div>
    );
  }

  const joinedRoomIds = new Set(joinedRooms.map((r) => r.id));
  const unjoinedPublicRooms = publicRooms.filter(
    (room) => !joinedRoomIds.has(room.id),
  );

  if (publicRooms.length === 0 && joinedRooms.length === 0) {
    return (
      <div className="flex-1 flex flex-col gap-4 mt-16">
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
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col gap-4 mt-16">
      <div className="flex flex-col gap-4 lg:gap-20">
        <RoomList
          title="Your Rooms"
          rooms={joinedRooms}
          isJoined
          onLeave={handleLeave}
        />
        <RoomList
          title="Public Rooms"
          rooms={unjoinedPublicRooms}
          onJoin={handleJoin}
        />
      </div>
    </div>
  );
}
