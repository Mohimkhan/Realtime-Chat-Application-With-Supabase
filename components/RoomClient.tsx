"use client";

import { Message } from "@/app/actions/message";
import { ChatInput } from "./ChatInput";
import { ChatMessage } from "./ChatMessage";
import { Button } from "./ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "./ui/card";

function InviteUserModal() {
  return <Button>Invite User</Button>;
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
  return (
    <div className="flex-1">
      <div>
        <Card className="mt-5 flex justify-between items-center px-4">
          <CardHeader>
            <CardTitle>{room.name}</CardTitle>
            <CardDescription>0 users online</CardDescription>
          </CardHeader>
          <InviteUserModal />
        </Card>
      </div>

      <div
        style={{
          scrollbarWidth: "thin",
          scrollbarColor: "var(--border) transparent",
        }}
        className="h-[calc(100%-170px)] flex flex-col-reverse overflow-y-auto"
      >
        <div>
          {messages.map((message) => (
            <ChatMessage
              key={message.id}
              {...message}
            />
          ))}
        </div>
      </div>
      <ChatInput roomId={room.id} />
    </div>
  );
}
