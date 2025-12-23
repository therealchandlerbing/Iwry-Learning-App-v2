"use client";

import { useState, useCallback, useEffect, useRef } from "react";

interface UseTextToSpeechReturn {
  speak: (text: string) => Promise<void>;
  stop: () => void;
  isSpeaking: boolean;
  isSupported: boolean;
}

export function useTextToSpeech(): UseTextToSpeechReturn {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [voicesLoaded, setVoicesLoaded] = useState(false);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const voicesRef = useRef<SpeechSynthesisVoice[]>([]);

  useEffect(() => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      synthRef.current = window.speechSynthesis;
      setIsSupported(true);

      // Load voices
      const loadVoices = () => {
        const availableVoices = synthRef.current?.getVoices() || [];
        voicesRef.current = availableVoices;
        setVoicesLoaded(true);
      };

      // Voices may load asynchronously
      loadVoices();

      // Listen for voices changed event (important for Chrome)
      if (synthRef.current) {
        synthRef.current.onvoiceschanged = loadVoices;
      }

      return () => {
        if (synthRef.current) {
          synthRef.current.onvoiceschanged = null;
        }
      };
    }
  }, []);

  const speak = useCallback(async (text: string) => {
    if (!synthRef.current || !isSupported) {
      console.error("Speech synthesis not supported");
      return;
    }

    // Cancel any ongoing speech
    synthRef.current.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "pt-BR";
    utterance.rate = 0.9; // Slightly slower for learning
    utterance.pitch = 1.0;

    // Get Brazilian Portuguese voice if available
    const portugueseVoice = voicesRef.current.find(
      (voice) =>
        voice.lang === "pt-BR" ||
        voice.lang.startsWith("pt-") ||
        voice.name.toLowerCase().includes("portuguese")
    );

    if (portugueseVoice) {
      utterance.voice = portugueseVoice;
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    utteranceRef.current = utterance;
    synthRef.current.speak(utterance);
  }, [isSupported, voicesLoaded]);

  const stop = useCallback(() => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    }
  }, []);

  return {
    speak,
    stop,
    isSpeaking,
    isSupported,
  };
}
