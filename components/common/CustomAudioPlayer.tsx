import { cn } from "@/lib/utils/cn";
import { Pause, Play, X } from "lucide-react";
import { useEffect, useRef, useState, useCallback } from "react";

const formatTime = (seconds: number): string => {
  if (!isFinite(seconds) || isNaN(seconds)) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
};

const CustomAudioPlayer = ({
  audioSrc,
  onRemove,
  className,
  hiddenRemoveBtn,
}: {
  audioSrc: string;
  onRemove?: () => void;
  className?: string;
  hiddenRemoveBtn?: boolean;
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const waveformRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isHoveringTimer, setIsHoveringTimer] = useState(false);
  const [barCount, setBarCount] = useState(30);

  // Each bar: 4px wide + 3px gap = 7px per bar
  const BAR_WIDTH = 4;
  const BAR_GAP = 3;

  const updateBarCount = useCallback((width: number) => {
    const count = Math.max(8, Math.floor(width / (BAR_WIDTH + BAR_GAP)));
    setBarCount(count);
  }, []);

  useEffect(() => {
    const el = waveformRef.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => {
      updateBarCount(entry.contentRect.width);
    });
    observer.observe(el);
    // Initial measurement
    updateBarCount(el.getBoundingClientRect().width);
    return () => observer.disconnect();
  }, [updateBarCount]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedMetadata = () => {
      setDuration(audio.duration ?? 0);
    };

    const updateProgress = () => {
      setCurrentTime(audio.currentTime);
      setProgress((audio.currentTime / audio.duration) * 100 || 0);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setProgress(0);
      setCurrentTime(0);
    };

    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("timeupdate", updateProgress);
    audio.addEventListener("ended", handleEnded);

    // In case metadata is already loaded (e.g. cached)
    if (audio.readyState >= 1) {
      setDuration(audio.duration ?? 0);
    }

    return () => {
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
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
    <div
      className={cn(
        `flex items-center justify-between w-[95%] max-w-sm bg-blue-500 rounded-3xl px-3 py-2 mx-auto absolute bottom-[100px] left-1/2 -translate-x-1/2 shadow-lg z-10 transition-all`,
        className,
      )}
    >
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

      <div
        ref={waveformRef}
        className="flex items-center justify-center gap-[3px] flex-1 min-w-0 mx-3 h-6 overflow-hidden"
      >
        {[...Array(barCount)].map((_, i) => {
          const isActive = progress > (i / barCount) * 100;
          // Generate a pseudo-random but stable height pattern using sine waves
          const height = Math.round(
            55 + 40 * Math.abs(Math.sin((i * 7 + 3) * 0.37)),
          );
          return (
            <div
              key={i}
              className={`rounded-full transition-colors duration-200 flex-shrink-0 ${isActive ? "bg-white" : "bg-black/20"}`}
              style={{
                width: `${BAR_WIDTH}px`,
                height: `${height}%`,
              }}
            />
          );
        })}
      </div>

      {/* Timer / Duration area — hover to reveal X button */}
      <div
        className="relative flex items-center flex-shrink-0 cursor-pointer"
        onMouseEnter={() => setIsHoveringTimer(true)}
        onMouseLeave={() => setIsHoveringTimer(false)}
      >
        {/* X button — only visible on hover, sits over the timer */}
        {!hiddenRemoveBtn && isHoveringTimer && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onRemove?.();
            }}
            className="absolute z-10 top-1/2 -translate-y-1/2 translate-x-1 inset-0 flex items-center justify-center size-8 bg-black/15 hover:bg-black/25 text-white rounded-full transition-colors"
          >
            <X size={16} />
          </button>
        )}

        <span
          className={cn(
            "text-white text-xs font-medium tabular-nums transition-opacity duration-150 min-w-[36px] text-center",
            !hiddenRemoveBtn && isHoveringTimer ? "opacity-0" : "opacity-100",
          )}
        >
          {isPlaying ? formatTime(currentTime) : formatTime(duration)}
        </span>
      </div>
    </div>
  );
};

export default CustomAudioPlayer;
