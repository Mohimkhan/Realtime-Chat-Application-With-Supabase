"use client";

import { Message } from "@/app/actions/message";
import { ChatInput } from "./ChatInput";
import { ChatMessage } from "./ChatMessage";
import { Card, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { formatCustomDate, groupBy } from "@/lib/utils";
import { ActionButton } from "./ui/action-button";
import { useRealTimeChat } from "@/hooks";

function InviteUserModal() {
  return (
    <ActionButton
      requireAreYouSure={true}
      areYouSureDescription="Are you sure you want to invite friends?"
      action={async () => ({ error: false, message: "" })}
    >
      Invite User
    </ActionButton>
  );
}

export default function RoomClient({
  room,
  user,
  messages,
}: {
  room: {
    id: string;
    name: string;
  };
  user: {
    id: string;
    name: string;
    image_url: string;
  };
  messages: Message[];
}) {
  const { connectedUsers } = useRealTimeChat({
    roomId: room.id,
    userId: user.id,
  });

  return (
    <div className="flex-1">
      <div>
        <Card className="mt-5 flex justify-between items-center px-4">
          <CardHeader>
            <CardTitle>{room.name}</CardTitle>
            <CardDescription>
              {connectedUsers} {connectedUsers === 1 ? "user" : "users"} online
            </CardDescription>
          </CardHeader>
          <InviteUserModal />
        </Card>
      </div>

      <div
        style={{
          scrollbarWidth: "thin",
          scrollbarColor: "var(--border) transparent",
        }}
        className="pt-4 h-[calc(100vh-315px)] flex flex-col-reverse overflow-y-auto px-3"
      >
        <div>
          {Object.entries(
            groupBy(
              messages.map((message) => {
                return {
                  ...message,
                  formattedDate: formatCustomDate(new Date(message.created_at))
                    .date,
                };
              }),
              "formattedDate",
            ),
          ).map(([date, messages]) => (
            <div className="mb-4">
              <div className="flex justify-center mb-6">
                <span className="py-1 px-2 text-black dark:text-white border-[1px] dark:border-white/50 border-black rounded-sm">
                  {formatCustomDate(new Date(date)).date}
                </span>
              </div>
              {messages.map((message) => (
                <ChatMessage
                  key={message.id}
                  currentUserId={user.id}
                  {...message}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
      <ChatInput roomId={room.id} />
    </div>
  );
}
