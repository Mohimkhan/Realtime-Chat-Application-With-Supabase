"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Dispatch, MutableRefObject, SetStateAction, useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";
import { Square, Trash2, Send, Triangle } from "lucide-react";
import { formatTime } from "@/lib/utils/user";

interface VoiceRecordingModalProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  setIsTextFieldDisabled: Dispatch<SetStateAction<boolean>>;
  selectedFile: File | null;
  setAudioChunks: Dispatch<SetStateAction<Blob[]>>;
  mediaRecorderRef: MutableRefObject<MediaRecorder | null>;
}

export default function VoiceRecordingModal({
  open,
  setOpen,
  setIsTextFieldDisabled,
  selectedFile,
  setAudioChunks,
  mediaRecorderRef,
}: VoiceRecordingModalProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [time, setTime] = useState(0);

  const stopTracks = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.stream) {
      mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());
    }
  };

  const handleCancel = () => {
    setOpen(false);
    setIsTextFieldDisabled(false);
    setAudioChunks([]);
    
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.ondataavailable = null;
      if (mediaRecorderRef.current.state !== "inactive") {
        mediaRecorderRef.current.stop();
      }
      stopTracks();
      mediaRecorderRef.current = null;
    }
  };

  const handleDone = () => {
    setOpen(false);
    
    if (mediaRecorderRef.current) {
      if (mediaRecorderRef.current.state === "recording") {
        mediaRecorderRef.current.requestData();
      }
      stopTracks();
      if (mediaRecorderRef.current.state !== "inactive") {
        mediaRecorderRef.current.stop();
      }
      // do not nullify yet so the final data event can process
      setTimeout(() => { mediaRecorderRef.current = null; }, 500);
    }
  };

  useEffect(() => {
    if (open) {
      setIsRecording(true);
      setTime(0);
      setAudioChunks([]);
    }
  }, [open, setAudioChunks]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (open && isRecording) {
      interval = setInterval(() => {
        setTime((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [open, isRecording]);

  useEffect(() => {
    const handleRecordingState = async () => {
      // Initialize if null
      if (!mediaRecorderRef.current) {
        if (!isRecording) return; // Don't ask for permission if not trying to record
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          const mediaRecorder = new MediaRecorder(stream);
          mediaRecorderRef.current = mediaRecorder;

          mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
              setAudioChunks((prev) => [...prev, event.data]);
            }
          };

          mediaRecorder.start();
        } catch (error) {
          console.error("Microphone permission denied or error:", error);
          setOpen(false);
          setIsTextFieldDisabled(false);
        }
      } else {
        // Manage existing recorder state
        if (isRecording) {
          if (mediaRecorderRef.current.state === "paused") {
            mediaRecorderRef.current.resume();
          }
        } else {
          if (mediaRecorderRef.current.state === "recording") {
            mediaRecorderRef.current.requestData();
            mediaRecorderRef.current.pause();
          }
        }
      }
    };

    if (open) {
      handleRecordingState();
    }
  }, [isRecording, open, setAudioChunks, setOpen, setIsTextFieldDisabled]);

  useEffect(() => {
    return () => {
      // Cleanup on unmount
      if (mediaRecorderRef.current) {
        if (mediaRecorderRef.current.state !== "inactive") {
          mediaRecorderRef.current.stop();
        }
        stopTracks();
      }
    };
  }, []);

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
                className={`w-1.5 bg-black/80 dark:bg-white/80 rounded-full transition-all duration-300 ease-in-out ${isRecording ? "animate-pulse" : ""}`}
                style={{
                  height:
                    isRecording
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
              onClick={handleCancel}
              title="Delete recording"
            >
              <Trash2 className="size-5" />
            </Button>

            {isRecording ? (
              <Button
                size="icon"
                className="rounded-full size-16 bg-red-500 hover:bg-red-600 text-white shadow-lg transition-transform hover:scale-105 active:scale-95"
                onClick={() => setIsRecording(false)}
                title="Pause recording"
              >
                <Square className="size-6 fill-current" />
              </Button>
            ) : (
              <Button
                size="icon"
                className="rounded-full size-16 bg-green-500 hover:bg-green-600 text-white shadow-lg transition-transform hover:scale-105 active:scale-95"
                onClick={() => setIsRecording(true)}
                title="Resume recording"
              >
                <Triangle className="size-6 fill-current rotate-90 ml-1" />
              </Button>
            )}

            <Button
              variant="default"
              size="icon"
              className="rounded-full size-12 bg-blue-500 hover:bg-blue-600 text-white shadow-md transition-transform hover:scale-105 active:scale-95"
              onClick={handleDone}
              title="Done recording"
            >
              <Send className="size-5 ml-0.5" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
