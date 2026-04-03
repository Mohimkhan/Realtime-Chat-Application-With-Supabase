"use client";

import { SendIcon } from "lucide-react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupTextarea,
} from "./ui/input-group";
import {
  Dispatch,
  FormEvent,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import { Message, sendMessage } from "@/app/actions/message";
import { Camera, X, Mic } from "lucide-react";
import { toast } from "react-toastify";
import { uploadImage } from "@/app/actions/upload";
import Image from "next/image";
import { Button } from "./ui/button";
import ImageViewerModal from "./modals/ImageViewerModal";
import VoiceRecordingModal from "./modals/VoiceRecordingModal";

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
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const [open, setOpen] = useState(false);
  const [imageSrc, setImageSrc] = useState<string>("");
  const [isVoiceRecordingOpen, setIsVoiceRecordingOpen] = useState(false);

  // Adjust the textarea height with the content and scroll, for all browsers as firefox doesn't support field-sizing
  useEffect(() => {
    if (textAreaRef.current) {
      if (message.length > 0) {
        textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`;
        textAreaRef.current.style.overflowY = "scroll";
        return;
      }

      textAreaRef.current.style.minHeight = "25px";
      textAreaRef.current.style.height = "25px";
      textAreaRef.current.style.overflowY = "hidden";
    }
  }, [message]);

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
      <ImageViewerModal
        open={open}
        setOpen={setOpen}
        imageSrc={imageSrc}
      />
      <VoiceRecordingModal
        open={isVoiceRecordingOpen}
        setOpen={setIsVoiceRecordingOpen}
      />
      <InputGroup className="container flex items-center bg-white text-black dark:text-white dark:!bg-black absolute bottom-[51px] left-1/2 -translate-x-1/2">
        <div className="flex items-center gap-1 pl-1">
          <div className="grid [grid-template-areas:overlay] place-items-center size-10 overflow-hidden relative">
            {selectedFile ? (
              <div className="relative size-full flex items-center justify-center">
                <Image
                  src={URL.createObjectURL(selectedFile)}
                  alt="Selected"
                  className="size-full object-cover rounded-md cursor-pointer"
                  fill
                  onClick={() => {
                    setOpen(true);
                    setImageSrc(URL.createObjectURL(selectedFile));
                  }}
                />
                <Button
                  type="button"
                  className="absolute -top-1 -right-1 size-4 bg-red-500 text-white rounded-full p-0.5 hover:scale-125 hover:bg-red-500"
                  onClick={() => setSelectedFile(null)}
                >
                  <X size={10} />
                </Button>
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
          {!selectedFile && (
            <button
              type="button"
              className="size-10 flex flex-shrink-0 items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-colors cursor-pointer text-gray-700 dark:text-gray-300"
              onClick={() => setIsVoiceRecordingOpen(true)}
              aria-label="Voice Record"
            >
              <Mic size={22} />
            </button>
          )}
        </div>
        <InputGroupTextarea
          ref={textAreaRef}
          placeholder="Type your message..."
          className="py-0.5 min-h-[25px] h-[25px] max-h-[200px]"
          style={{
            scrollbarWidth: "thin",
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
