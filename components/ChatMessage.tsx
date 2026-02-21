import { Message } from "@/app/actions/message";
import { formatCustomDate } from "@/lib/utils";
import Image from "next/image";

export function ChatMessage({
  text,
  author_id,
  created_at,
  author,
  currentUserId,
}: Message & { currentUserId: string }) {
  return (
    <div
      className={`flex mb-3 items-center gap-2 ${author_id === currentUserId ? "justify-end" : "justify-start"}`}
    >
      {author.image_url != null ? (
        <Image
          src={author.image_url}
          alt={author.name}
          width={40}
          height={40}
          className="rounded-full border-[2px] dark:border-white/50 border-black"
        />
      ) : (
        <div className="w-10 h-10 rounded-full bg-gray-500 flex items-center justify-center border-[2px] dark:border-white/50 border-black">
          <span className="text-white font-bold">
            {author.name.trim().split(" ")[0][0]}
          </span>
        </div>
      )}
      <div className={`flex flex-col`}>
        <span className="text-sm font-bold">{author.name}</span>
        <span className="text-sm text-white">
          {text}{" "}
          <span className="text-sm text-gray-500">
            -- {formatCustomDate(new Date(created_at)).time}
          </span>
        </span>
      </div>
    </div>
  );
}
