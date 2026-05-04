import { Message } from "@/app/actions/message";
import { formatCustomDate } from "@/lib/utils";
import Image from "next/image";
import { LoadingSwap } from "./ui/loading-swap";
import ImageModalWrapper from "./common/ImageModalWrapper";
import CustomAudioPlayer from "./common/CustomAudioPlayer";

/**
 * TODO[FIX_1]: Handle image-error status
 * TODO[REFACTOR_2]: Refactor the status image-uploading to be more simplier with if else conditions
 */

export function ChatMessage({
  text,
  image_url,
  audio_url,
  author_id,
  created_at,
  author,
  currentUserId,
  status,
}: Message & { currentUserId: string }) {
  const render = () => {
    if (status === "audio-uploading") {
      return (
        <div
          className={`w-full h-[40px] max-w-sm rounded-3xl flex gap-2 justify-center items-center border-[2px] dark:border-white/50 border-black object-cover animate-pulse `}
        >
          <LoadingSwap isLoading={status === "audio-uploading"}>
            ...
          </LoadingSwap>
          Audio Uploading
        </div>
      );
    }

    if (audio_url) {
      return (
        <div
          className={`text-sm bg-blue-600 text-white rounded-md p-2 flex flex-col ${author_id === currentUserId ? "items-start" : "items-end"} gap-2 text-justify w-fit`}
        >
          {text && (
            <div className="flex w-full px-1">
              <pre className="text-wrap font-sans">{text}</pre>
            </div>
          )}
          <CustomAudioPlayer
            audioSrc={audio_url}
            className="static bottom-auto left-auto translate-x-0 mx-0 w-full max-w-full bg-transparent shadow-none p-1"
            hiddenRemoveBtn={author_id !== currentUserId}
          />
        </div>
      );
    }

    if (status === "image-uploading") {
      return (
        <div
          className={`w-60 h-[200px] flex gap-2 justify-center items-center rounded-md border-[2px] dark:border-white/50 border-black object-cover ${text ? "-mt-2" : ""} animate-pulse `}
        >
          <LoadingSwap isLoading={status === "image-uploading"}>
            ...
          </LoadingSwap>
          Image Uploading
        </div>
      );
    }

    if (image_url) {
      return (
        <div className="rounded-md border-[2px] dark:border-white/50 border-black overflow-hidden">
          {text && (
            <div className="text-sm text-white w-full flex bg-blue-700 px-2 pt-1 pb-3 gap-1 flex-col items-start">
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
                  className={`w-60 h-60 object-cover cursor-pointer ${text ? "-mt-2" : ""}`}
                />
              )}
            </ImageModalWrapper>
          </div>
        </div>
      );
    }
  };

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
          className={`rounded-full aspect-square object-cover border-[2px] dark:border-white/50 border-black ${author_id !== currentUserId ? "order-2" : ""}`}
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
      
      <div
        className={`w-full flex flex-col gap-2 ${author_id === currentUserId ? "items-start" : "items-end"} ${status === "sending" ? "opacity-50" : ""}`}
      >
        <div className="flex items-baseline text-sm font-bold">
          <span>{author?.name ?? "Unknown"} </span>
          {!(text && image_url) && (
            <span className="text-sm text-gray-500 text-nowrap ml-[10px]">
              {formatCustomDate(new Date(created_at)).time}
            </span>
          )}
        </div>
        {text && !image_url && !audio_url && (
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
        )}
        {render()}
      </div>
    </div>
  );
}
