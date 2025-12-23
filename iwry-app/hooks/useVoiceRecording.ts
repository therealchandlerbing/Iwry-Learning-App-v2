"use client";

import { useState, useRef, useCallback, useEffect } from "react";

export type VoiceStatus = "idle" | "listening" | "processing" | "speaking" | "error";

interface UseVoiceRecordingReturn {
  status: VoiceStatus;
  transcript: string;
  error: string | null;
  isSupported: boolean;
  startListening: () => void;
  stopListening: () => void;
  resetTranscript: () => void;
}

export function useVoiceRecording(): UseVoiceRecordingReturn {
  const [status, setStatus] = useState<VoiceStatus>("idle");
  const [transcript, setTranscript] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSupported, setIsSupported] = useState(false);

  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Check if Web Speech API is supported
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        (window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition;

      if (SpeechRecognition) {
        setIsSupported(true);
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = "pt-BR";

        recognitionRef.current.onresult = (event: any) => {
          const results = event.results;
          const lastResult = results[results.length - 1];

          if (lastResult.isFinal) {
            const finalTranscript = lastResult[0].transcript;
            setTranscript(finalTranscript);
            setStatus("processing");
          } else {
            // Interim results
            setTranscript(lastResult[0].transcript);
          }
        };

        recognitionRef.current.onerror = (event: any) => {
          console.error("Speech recognition error:", event.error);
          setError(`Voice recognition error: ${event.error}`);
          setStatus("error");
        };

        recognitionRef.current.onend = () => {
          if (status === "listening") {
            setStatus("idle");
          }
        };
      } else {
        setIsSupported(false);
        setError("Speech recognition is not supported in this browser. Please use Chrome, Edge, or Safari.");
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const startListening = useCallback(() => {
    if (!isSupported) {
      setError("Speech recognition is not supported in this browser");
      setStatus("error");
      return;
    }

    setError(null);
    setTranscript("");
    setStatus("listening");

    try {
      recognitionRef.current?.start();
    } catch (err) {
      console.error("Error starting speech recognition:", err);
      setError("Failed to start voice recognition");
      setStatus("error");
    }
  }, [isSupported]);

  const stopListening = useCallback(() => {
    try {
      recognitionRef.current?.stop();
      setStatus("idle");
    } catch (err) {
      console.error("Error stopping speech recognition:", err);
    }
  }, []);

  const resetTranscript = useCallback(() => {
    setTranscript("");
    setError(null);
    setStatus("idle");
  }, []);

  return {
    status,
    transcript,
    error,
    isSupported,
    startListening,
    stopListening,
    resetTranscript,
  };
}
