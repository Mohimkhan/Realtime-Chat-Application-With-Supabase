"use client";

import { SendIcon } from "lucide-react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupTextarea,
} from "./ui/input-group";
import { FormEvent, useState } from "react";
import { toast } from "react-toastify";
import { sendMessage } from "@/app/actions/message";


export function ChatInput({ roomId }: { roomId: string }) {
  const [message, setMessage] = useState<string>("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const text = message?.trim();
    if (!text) return;

    const result = await sendMessage(text, roomId);

    if (result?.error) {
      toast.error(result?.message);
    } else {
      setMessage("");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <InputGroup className="container !bg-black absolute bottom-[51px] left-1/2 -translate-x-1/2">
        <InputGroupTextarea
          placeholder="Type your message..."
          className="min-h-auto"
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
