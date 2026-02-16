"use client";

import { ChatMessage } from "./ChatMessage";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";

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
  messages: {
    id: string;
    text: string;
    created_at: string;
    author_id: string;
    author: {
      name: string;
      image_url: string;
    }[];
  }[];
}) {
  return (
    <div className="flex-1">
      <div>
        <Card className="flex justify-between items-center px-4">
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
        className="flex flex-col-reverse overflow-y-auto"
      >
        {messages.map((message) => (
          <ChatMessage
            key={message.id}
            {...message}
          />
        ))}
      </div>
    </div>
  );
}
