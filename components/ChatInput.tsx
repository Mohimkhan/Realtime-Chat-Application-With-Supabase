"use client";

import { SendIcon } from "lucide-react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupTextarea,
} from "./ui/input-group";
import { Dispatch, FormEvent, SetStateAction, useState } from "react";
import { Message, sendMessage } from "@/app/actions/message";
import { Camera } from "lucide-react";
import { toast } from "react-toastify";

export function ChatInput({
  roomId,
  setMessages,
  user,
}: {
  roomId: string;
  setMessages: Dispatch<SetStateAction<Message[]>>;
  user: {
    id: string;
    name: string;
    image_url: string;
  };
}) {
  const [message, setMessage] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const text = message?.trim();
    if (!text) return;

    const messageId = crypto.randomUUID();
    const newMessage: Message = {
      id: messageId,
      text,
      created_at: new Date().toISOString(),
      author_id: user.id,
      status: "sending",
      author: {
        name: user.name,
        image_url: user.image_url,
      },
    };

    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setMessage("");

    const result = await sendMessage(text, roomId, undefined, messageId);

    if (result.error) {
      toast.error(result.message);
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.id === messageId ? { ...msg, status: "error" } : msg,
        ),
      );
    } else {
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.id === messageId ? result.message : msg,
        ),
      );
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <InputGroup className="container flex items-center bg-white text-black dark:text-white dark:!bg-black absolute bottom-[51px] left-1/2 -translate-x-1/2">
        <div className="grid [grid-template-areas:overlay] place-items-center size-10 overflow-hidden">
          <Camera className="[grid-area:overlay]" />
          <input
            type="file"
            name="fileUpload"
            id="fileUpload"
            className="opacity-0 [grid-area:overlay] size-10 cursor-pointer"
            onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
          />
        </div>
        <InputGroupTextarea
          placeholder="Type your message..."
          className="min-h-[45px]"
          style={{
            fieldSizing: "content",
          }}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
        />
        <InputGroupAddon align="inline-end">
          <InputGroupButton
            type="submit"
            aria-label="Send"
            title="Send"
            size={"icon-sm"}
          >
            <SendIcon />
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </form>
  );
}
