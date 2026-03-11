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
import { Camera, X } from "lucide-react";
import { toast } from "react-toastify";
import { uploadImage } from "@/app/actions/upload";

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
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const maxSize = 3 * 1024 * 1024; // 3MB
    if (file.size > maxSize) {
      toast.error("Image size must be less than 3MB");
      e.target.value = ""; // Reset input
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      e.target.value = "";
      return;
    }

    setSelectedFile(file);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const text = message?.trim();
    if (!text && !selectedFile) return;
    if (isUploading) return;

    setIsUploading(true);

    const messageId = crypto.randomUUID();
    const newMessage: Message = {
      id: messageId,
      text: text ?? null,
      created_at: new Date().toISOString(),
      author_id: user.id,
      status: selectedFile ? "image-uploading" : "sending",
      author: {
        name: user.name,
        image_url: user.image_url,
      },
    };

    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setMessage("");
    setSelectedFile(null);

    let imageUrl = undefined;
    if (selectedFile) {
      const formData = new FormData();
      formData.append("image", selectedFile);
      const uploadResult = await uploadImage(formData);

      if (!uploadResult.success) {
        toast.error(uploadResult.error);
        setMessages((prevMessages) =>
          prevMessages.map((msg) =>
            msg.id === messageId ? { ...msg, status: "image-error" } : msg,
          ),
        );
        setIsUploading(false);
        return;
      }
      imageUrl = uploadResult.url;
    }

    const result = await sendMessage(text, roomId, imageUrl, messageId);
    setIsUploading(false);

    if (result?.error) {
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
        <div className="grid [grid-template-areas:overlay] place-items-center size-10 overflow-hidden relative">
          {selectedFile ? (
            <div className="relative size-full flex items-center justify-center">
              <img
                src={URL.createObjectURL(selectedFile)}
                alt="Selected"
                className="size-full object-cover rounded-md"
              />
              <button
                type="button"
                className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5"
                onClick={() => setSelectedFile(null)}
              >
                <X size={12} />
              </button>
            </div>
          ) : (
            <>
              <Camera className="[grid-area:overlay]" />
              <input
                type="file"
                name="fileUpload"
                id="fileUpload"
                className={`opacity-0 [grid-area:overlay] size-10 cursor-pointer ${isUploading ? "pointer-events-none" : ""}`}
                accept="image/*"
                onChange={handleFileChange}
              />
            </>
          )}
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
            disabled={isUploading || (!message.trim() && !selectedFile)}
          >
            <SendIcon className={isUploading ? "animate-pulse" : ""} />
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </form>
  );
}
