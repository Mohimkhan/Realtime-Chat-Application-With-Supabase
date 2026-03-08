import { Message } from "@/app/actions/message";
import { formatCustomDate } from "@/lib/utils";
import Image from "next/image";

export function ChatMessage({
  text,
  image_url,
  author_id,
  created_at,
  author,
  currentUserId,
  status,
}: Message & { currentUserId: string }) {
  return (
    <div
      className={`flex ${image_url ? "mb-10" : "mb-3"} items-start gap-2 ${author_id === currentUserId ? "justify-start" : "justify-end"}`}
    >
      {author?.image_url != null ? (
        <Image
          src={author?.image_url}
          alt={author?.name ?? "Unknown"}
          width={40}
          height={40}
          className={`rounded-full border-[2px] dark:border-white/50 border-black ${author_id !== currentUserId ? "order-2" : ""}`}
        />
      ) : (
        <div
          className={`w-10 min-w-10 h-10 rounded-full bg-gray-500 flex items-center justify-center border-[2px] dark:border-white/50 border-black ${author_id !== currentUserId ? "order-2" : ""}`}
        >
          <span className="text-white font-bold">
            {author?.name?.trim().split(" ")[0][0] ?? "U"}
          </span>
        </div>
      )}

      {image_url ? (
        <div>
          {text && (
            <div className="text-sm text-white w-full flex bg-blue-700 rounded-md px-2 pt-1 pb-3 gap-1 flex-col items-end">
              <span>{text}</span>
              <span className="text-sm text-gray-400 ml-auto text-nowrap">
                -- {formatCustomDate(new Date(created_at)).time}
              </span>
            </div>
          )}
          <Image
            src={image_url}
            alt={author?.name ?? "Unknown"}
            width={230}
            height={230}
            className={`w-60 h-auto rounded-md border-[2px] dark:border-white/50 border-black object-cover ${text ? "-mt-2" : ""} `}
          />
        </div>
      ) : (
        <div
          className={`flex flex-col ${author_id === currentUserId ? "items-start" : "items-end"} ${status === "sending" ? "opacity-50" : ""}`}
        >
          <span className="text-sm font-bold">{author?.name ?? "Unknown"}</span>
          <span className="text-sm text-black dark:text-white flex items-end gap-2 text-justify">
            <span>
              {text}{" "}
              <span className="text-sm text-gray-500 text-nowrap">
                {" "}
                -- {formatCustomDate(new Date(created_at)).time}
              </span>
            </span>
            {status === "error" && (
              <span className="text-red-500 text-xs italic">
                Failed to send
              </span>
            )}
          </span>
        </div>
      )}
    </div>
  );
}
