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

/*
 * TODO[FEAT]: IF text is too long then the input area expands and it's not looking good, So make some change to make it good
 */

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
      <InputGroup>
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
