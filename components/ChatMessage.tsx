import { Message } from "@/app/actions/message";
import { formatCustomDate } from "@/lib/utils";
import Image from "next/image";
import { LoadingSwap } from "./ui/loading-swap";
import ImageModalWrapper from "./common/ImageModalWrapper";

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
      className={`flex ${image_url ? "mb-10" : "mb-5"} items-start gap-2 ${author_id === currentUserId ? "justify-start" : "justify-end"}`}
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
            {author?.name?.trim().split(" ")[0][0] ?? "U"}{" "}
          </span>
        </div>
      )}

      {status === "image-uploading" ? (
        <div
          className={`w-60 h-[200px] flex gap-2 justify-center items-center rounded-md border-[2px] dark:border-white/50 border-black object-cover ${text ? "-mt-2" : ""} animate-pulse `}
        >
          <LoadingSwap isLoading={status === "image-uploading"}>
            ...
          </LoadingSwap>
          Image Uploading
        </div>
      ) : image_url ? (
        <div>
          {text && (
            <div className="text-sm text-white w-full flex bg-blue-700 rounded-md px-2 pt-1 pb-3 gap-1 flex-col items-start">
              <pre className="text-wrap">{text}</pre>
              <span className="text-sm text-gray-400 ml-auto text-nowrap">
                {formatCustomDate(new Date(created_at)).time}
              </span>
            </div>
          )}
          <div
            className={`flex flex-col gap-1 ${author_id === currentUserId ? "items-start" : "items-end"}`}
          >
            <ImageModalWrapper imageSrc={image_url}>
              {(setOpen) => (
                <Image
                  onClick={() => setOpen(true)}
                  src={image_url}
                  alt="Image Not Found!"
                  width={240}
                  height={240}
                  className={`w-60 h-60 rounded-md border-[2px] dark:border-white/50 border-black object-cover cursor-pointer ${text ? "-mt-2" : ""}`}
                />
              )}
            </ImageModalWrapper>
            {!text && (
              <span className="text-sm text-gray-400 text-nowrap">
                {formatCustomDate(new Date(created_at)).time}
              </span>
            )}
          </div>
        </div>
      ) : (
        <div
          className={`flex flex-col gap-2 ${author_id === currentUserId ? "items-start" : "items-end"} ${status === "sending" ? "opacity-50" : ""}`}
        >
          <div className="flex items-baseline text-sm font-bold">
            <span>{author?.name ?? "Unknown"} </span>
            <span className="text-sm text-gray-500 text-nowrap ml-[10px]">
              {formatCustomDate(new Date(created_at)).time}
            </span>
          </div>
          <span
            className={`text-sm bg-blue-600 text-white rounded-md p-2 flex flex-col ${author_id === currentUserId ? "items-start" : "items-end"} gap-2 text-justify`}
          >
            <div className="flex">
              <pre className="text-wrap">{text}</pre>
            </div>
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
