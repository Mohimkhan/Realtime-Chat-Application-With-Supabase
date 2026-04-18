import { Pause, Play, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const CustomAudioPlayer = ({
  audioSrc,
  onRemove,
}: {
  audioSrc: string;
  onRemove: () => void;
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    console.log("audio config", {
      currentTime: audio.currentTime,
      duration: audio.duration,
    });

    const updateProgress = () => {
      setProgress((audio.currentTime / audio.duration) * 100 || 0);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setProgress(0);
    };

    audio.addEventListener("timeupdate", updateProgress);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", updateProgress);
      audio.removeEventListener("ended", handleEnded);
    };
  }, []);

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="flex items-center justify-between w-[95%] max-w-sm bg-blue-500 rounded-[24px] px-3 py-2 mx-auto absolute bottom-[100px] left-1/2 -translate-x-1/2 shadow-lg z-10 transition-all">
      <audio
        ref={audioRef}
        src={audioSrc}
        preload="metadata"
      />

      <button
        type="button"
        onClick={togglePlayPause}
        className="flex items-center justify-center size-8 bg-black/15 hover:bg-black/25 rounded-full text-white transition-colors flex-shrink-0"
      >
        {isPlaying ? (
          <Pause
            size={16}
            fill="currentColor"
          />
        ) : (
          <Play
            size={16}
            fill="currentColor"
            className="ml-1"
          />
        )}
      </button>

      <div className="flex items-center justify-center gap-[3px] flex-1 mx-4 h-6">
        {[...Array(30)].map((_, i) => {
          const isActive = progress > (i / 30) * 100;
          const height = [
            40, 60, 80, 100, 70, 50, 90, 60, 80, 40, 50, 90, 70, 100, 60, 40,
            80, 90, 50, 70, 100, 60, 40, 80, 90, 50, 70, 80, 60, 40,
          ][i];
          return (
            <div
              key={i}
              className={`w-1 rounded-full transition-colors duration-200 ${isActive ? "bg-white" : "bg-black/20"}`}
              style={{
                height: `${height}%`,
              }}
            />
          );
        })}
      </div>

      <button
        type="button"
        onClick={onRemove}
        className="flex items-center justify-center size-8 bg-black/15 hover:bg-black/25 text-white rounded-full transition-colors flex-shrink-0"
      >
        <X size={16} />
      </button>
    </div>
  );
};

export default CustomAudioPlayer;
