"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Square, Play, Trash2, Send, Pause } from "lucide-react";

interface VoiceRecordingModalProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  setIsTextFieldDisabled: Dispatch<SetStateAction<boolean>>;
  selectedFile: File | null;
}

export default function VoiceRecordingModal({
  open,
  setOpen,
  setIsTextFieldDisabled,
  selectedFile,
}: VoiceRecordingModalProps) {
  const [isRecording, setIsRecording] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [time, setTime] = useState(0);

  useEffect(() => {
    if (open) {
      setIsRecording(true);
      setIsPlaying(false);
      setTime(0);
    }
  }, [open]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (open && (isRecording || isPlaying)) {
      interval = setInterval(() => {
        setTime((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [open, isRecording, isPlaying]);

  // Format time as mm:ss
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleClose = () => {
    setOpen(false);
    setIsTextFieldDisabled(false);
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        setOpen(open);
        if (selectedFile && time > 0) {
          setIsTextFieldDisabled(true);
          return;
        }

        setIsTextFieldDisabled(false);
      }}
    >
      <DialogContent className="sm:max-w-md bg-white dark:bg-black rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-center text-lg font-medium">
            Voice Recording
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center justify-center py-8 gap-8">
          <div className="flex items-center justify-center gap-3">
            {isRecording && (
              <div className="size-3.5 rounded-full bg-red-500 animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.6)]" />
            )}
            <span className="text-5xl font-mono tabular-nums tracking-wider text-black dark:text-white">
              {formatTime(time)}
            </span>
          </div>

          <div className="flex items-center justify-center gap-1.5 h-16 w-full px-6">
            {[...Array(30)].map((_, i) => (
              <div
                key={i}
                className={`w-1.5 bg-black/80 dark:bg-white/80 rounded-full transition-all duration-300 ease-in-out ${isRecording || isPlaying ? "animate-pulse" : ""}`}
                style={{
                  height:
                    isRecording || isPlaying
                      ? `${(Math.sin(i * 0.4 + time) * 0.4 + 0.6) * 100}%`
                      : "15%",
                  animationDelay: `${i * 0.05}s`,
                  animationDuration: "1s",
                }}
              />
            ))}
          </div>

          <div className="flex items-center gap-6 mt-4">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full size-12 hover:bg-red-100 hover:text-red-500 dark:hover:bg-red-900/30 transition-colors"
              onClick={handleClose}
              title="Delete recording"
            >
              <Trash2 className="size-5" />
            </Button>

            {isRecording ? (
              <Button
                size="icon"
                className="rounded-full size-16 bg-red-500 hover:bg-red-600 text-white shadow-lg transition-transform hover:scale-105 active:scale-95"
                onClick={() => setIsRecording(false)}
                title="Stop recording"
              >
                <Square className="size-6 fill-current" />
              </Button>
            ) : (
              <Button
                size="icon"
                className="rounded-full size-16 bg-primary hover:bg-primary/90 text-white shadow-lg transition-transform hover:scale-105 active:scale-95"
                onClick={handlePlayPause}
                title={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? (
                  <Pause className="size-7 fill-current" />
                ) : (
                  <Play className="size-7 fill-current pl-1" />
                )}
              </Button>
            )}

            <Button
              variant="default"
              size="icon"
              className="rounded-full size-12 bg-blue-500 hover:bg-blue-600 text-white shadow-md transition-transform hover:scale-105 active:scale-95"
              onClick={handleClose}
              title="Send recording"
              disabled={isRecording}
            >
              <Send className="size-5 ml-0.5" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
