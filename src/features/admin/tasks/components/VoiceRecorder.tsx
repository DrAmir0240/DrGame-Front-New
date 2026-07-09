"use client";

import { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui";

interface Props {
  onChange?: (file: File | null) => void;
}

export default function VoiceRecorder({ onChange }: Props) {
  const [state, setState] = useState<"idle" | "recording" | "recorded">("idle");
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval>>(undefined);
  const wsRef = useRef<any>(null);
  const waveformRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (state !== "recorded" || !audioUrl || !waveformRef.current) return;

    let ws: any;
    (async () => {
      const WaveSurfer = (await import("wavesurfer.js")).default;
      ws = WaveSurfer.create({
        container: waveformRef.current!,
        waveColor: "#94a3b8",
        progressColor: "#64748b",
        barWidth: 2,
        barRadius: 2,
        cursorWidth: 0,
        height: 48,
        url: audioUrl,
      });
      ws.on("play", () => setIsPlaying(true));
      ws.on("pause", () => setIsPlaying(false));
      ws.on("finish", () => setIsPlaying(false));
      wsRef.current = ws;
    })();

    return () => {
      if (ws) {
        ws.unAll();
        ws.destroy();
      }
      wsRef.current = null;
    };
  }, [state, audioUrl]);

  useEffect(() => {
    return () => {
      if (wsRef.current) {
        wsRef.current.unAll();
        wsRef.current.destroy();
        wsRef.current = null;
      }
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
  }, [audioUrl]);

  async function startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      chunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        stream.getTracks().forEach((t) => t.stop());
        clearInterval(timerRef.current);
        setDuration(0);

        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        setState("recorded");
        onChange?.(new File([blob], "voice.webm", { type: "audio/webm" }));
      };

      recorder.start();
      setState("recording");
      setDuration(0);
      timerRef.current = setInterval(() => {
        setDuration((d) => d + 1);
      }, 1000);
    } catch {
      // permission denied or no mic
    }
  }

  function stopRecording() {
    mediaRecorderRef.current?.stop();
  }

  function togglePlay() {
    if (!wsRef.current) return;
    wsRef.current.playPause();
  }

  function removeAudio() {
    if (wsRef.current) {
      wsRef.current.unAll();
      wsRef.current.destroy();
      wsRef.current = null;
    }
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setAudioUrl(null);
    setState("idle");
    onChange?.(null);
  }

  function formatTime(seconds: number) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  }

  if (state === "recorded" && audioUrl) {
    return (
      <div className="space-y-2">
        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-200">ویس</label>
        <div className="flex items-center gap-2 rounded-md border border-neutral-200 bg-neutral-50 px-3 py-2 dark:border-neutral-700 dark:bg-neutral-900">
          <Button
            type="button"
            variant="default"
            size="icon"
            className="h-8 w-8 shrink-0 rounded-full text-sm"
            onClick={togglePlay}
          >
            {isPlaying ? "❚❚" : "▶"}
          </Button>
          <div ref={waveformRef} className="flex-1" />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="text-xs text-red-500 hover:text-red-700"
            onClick={removeAudio}
          >
            حذف
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-200">ویس</label>
      <Button
        type="button"
        variant="outline"
        size="sm"
        className={`gap-2 animate-none ${state === "recording" ? "border-error-400 hover:bg-error-50" : ""}`}
        onMouseDown={state === "idle" ? startRecording : stopRecording}
      >
        <span className={`inline-block h-3 w-3 rounded-full bg-error ${state === "recording" ? " animate-pulse " : "bg-current"}`} />
        {state === "recording" ? formatTime(duration) : "ضبط ویس"}
      </Button>
    </div>
  );
}
