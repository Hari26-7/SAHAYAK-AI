import { useState, useEffect, useRef, useCallback } from 'react';

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

/**
 * Custom React Hook for Voice Assistant using native browser Web Speech API
 */
export const useVoiceAssistant = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    const loadVoices = () => {
      const avail = window.speechSynthesis.getVoices();
      setVoices(avail);
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  // Text-to-Speech Play function
  const play = useCallback((textToRead?: string, lang = 'en') => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      console.warn('SpeechSynthesis not supported');
      return;
    }

    // If currently paused, resume instead
    if (isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
      setIsSpeaking(true);
      return;
    }

    window.speechSynthesis.cancel();

    // Default: read the current page's main text content
    let content = textToRead;
    if (!content) {
      const main = document.querySelector('main');
      content = main ? main.innerText : document.body.innerText;
    }

    // Clean up unnecessary whitespaces
    content = content.replace(/\s+/g, ' ').trim();
    if (!content) return;

    const utterance = new SpeechSynthesisUtterance(content);
    utteranceRef.current = utterance;

    const langCode = lang === 'hi' ? 'hi-IN' : lang === 'ta' ? 'ta-IN' : 'en-IN';
    utterance.lang = langCode;
    utterance.rate = 0.95;
    utterance.pitch = 1.0;

    const matchedVoice = voices.find(
      (v) => v.lang === langCode || v.lang.replace('_', '-').startsWith(langCode.substring(0, 2))
    );
    if (matchedVoice) utterance.voice = matchedVoice;

    utterance.onstart = () => {
      setIsSpeaking(true);
      setIsPaused(false);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      setIsPaused(false);
    };

    utterance.onerror = (e) => {
      console.error('Speech synthesis error:', e);
      setIsSpeaking(false);
      setIsPaused(false);
    };

    window.speechSynthesis.speak(utterance);
  }, [isPaused, voices]);

  // Pause function
  const pause = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window && isSpeaking) {
      window.speechSynthesis.pause();
      setIsPaused(true);
      setIsSpeaking(false);
    }
  }, [isSpeaking]);

  // Stop function
  const stop = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setIsPaused(false);
    }
  }, []);

  return {
    play,
    pause,
    stop,
    isSpeaking,
    isPaused,
    supported: typeof window !== 'undefined' && 'speechSynthesis' in window,
  };
};

export const useSpeechSynthesis = useVoiceAssistant;

export const useSpeechRecognition = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const recognitionRef = useRef<any>(null);

  const SpeechRecognitionClass =
    typeof window !== 'undefined'
      ? window.SpeechRecognition || window.webkitSpeechRecognition
      : null;

  const isSupported = Boolean(SpeechRecognitionClass);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
    }
    setIsListening(false);
  }, []);

  const startListening = useCallback(
    (lang = 'en', onResult?: (text: string) => void) => {
      if (!isSupported) return;
      stopListening();

      try {
        const recognition = new SpeechRecognitionClass();
        recognitionRef.current = recognition;
        recognition.lang = lang === 'hi' ? 'hi-IN' : lang === 'ta' ? 'ta-IN' : 'en-IN';
        recognition.interimResults = true;

        recognition.onstart = () => setIsListening(true);
        recognition.onresult = (event: any) => {
          let current = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            current += event.results[i][0].transcript;
          }
          setTranscript(current);
          if (onResult && event.results[event.results.length - 1].isFinal) {
            onResult(current);
          }
        };
        recognition.onend = () => setIsListening(false);
        recognition.start();
      } catch {
        setIsListening(false);
      }
    },
    [isSupported, stopListening, SpeechRecognitionClass]
  );

  return {
    isListening,
    transcript,
    isSupported,
    startListening,
    stopListening,
    resetTranscript: () => setTranscript(''),
  };
};
