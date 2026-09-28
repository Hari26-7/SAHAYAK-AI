import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useVoiceAssistant, useSpeechRecognition } from '../lib/useSpeech';

/**
 * Top Header Voice Controls section
 */
export const HeaderVoiceControls: React.FC = () => {
  const { language } = useLanguage();
  const { play, pause, stop, isSpeaking, isPaused } = useVoiceAssistant();

  return (
    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-blue-50 dark:bg-slate-800 border border-blue-200 dark:border-slate-700 shadow-sm">
      <span className="text-xs font-bold text-gov-navy dark:text-blue-400 flex items-center gap-1">
        <span>🔊</span>
        <span className="hidden sm:inline">Sahayak Voice:</span>
      </span>

      <div className="flex items-center gap-1">
        {/* Play Button */}
        <button
          onClick={() => play(undefined, language)}
          className={`px-2 py-0.5 rounded text-[11px] font-bold transition-all ${
            isSpeaking
              ? 'bg-emerald-600 text-white shadow-sm animate-pulse'
              : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-600 border border-slate-200 dark:border-slate-600'
          }`}
          title="Read Current Page Aloud"
        >
          ▶ Play
        </button>

        {/* Pause Button */}
        <button
          onClick={pause}
          disabled={!isSpeaking}
          className={`px-2 py-0.5 rounded text-[11px] font-bold transition-all ${
            isPaused
              ? 'bg-amber-600 text-white'
              : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-600 border border-slate-200 dark:border-slate-600 disabled:opacity-40 disabled:cursor-not-allowed'
          }`}
          title="Pause Reading"
        >
          ⏸ Pause
        </button>

        {/* Stop Button */}
        <button
          onClick={stop}
          disabled={!isSpeaking && !isPaused}
          className="px-2 py-0.5 rounded text-[11px] font-bold bg-white dark:bg-slate-700 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 border border-slate-200 dark:border-slate-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          title="Stop Reading"
        >
          ⏹ Stop
        </button>
      </div>
    </div>
  );
};

/**
 * Fixed Floating Button at bottom-right of screen
 */
export const VoiceAssistant: React.FC = () => {
  const { language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const { play, pause, stop, isSpeaking, isPaused } = useVoiceAssistant();
  const { isListening, transcript, startListening, stopListening } = useSpeechRecognition();

  const handleToggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening(language, (text) => {
        window.dispatchEvent(new CustomEvent('sahayak-voice-command', { detail: { query: text } }));
      });
    }
  };

  return (
    <>
      {/* Floating Bottom-Right Button */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
        {isOpen && (
          <div className="w-80 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-2xl mb-2 animate-in fade-in slide-in-from-bottom-2 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
              <div className="flex items-center gap-2">
                <span className="text-lg">🔊</span>
                <div>
                  <h4 className="text-xs font-black text-gov-navy dark:text-blue-400 uppercase tracking-wider">
                    Sahayak Voice Assistant
                  </h4>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">
                    Web Speech API • Screen Reader
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs font-bold p-1"
              >
                ✕
              </button>
            </div>

            {/* Play, Pause, Stop Controls */}
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-2">
              <div className="text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                <span>Text-to-Speech Controls</span>
                {isSpeaking && (
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold animate-pulse">
                    ● Speaking
                  </span>
                )}
              </div>

              <div className="grid grid-cols-3 gap-1.5">
                <button
                  onClick={() => play(undefined, language)}
                  className={`py-1.5 px-2 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1 ${
                    isSpeaking
                      ? 'bg-emerald-600 text-white'
                      : 'bg-gov-navy dark:bg-blue-600 hover:bg-[#001a38] text-white'
                  }`}
                >
                  ▶ Play
                </button>
                <button
                  onClick={pause}
                  disabled={!isSpeaking}
                  className="py-1.5 px-2 rounded-lg text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white disabled:opacity-40 disabled:cursor-not-allowed transition flex items-center justify-center gap-1"
                >
                  ⏸ Pause
                </button>
                <button
                  onClick={stop}
                  disabled={!isSpeaking && !isPaused}
                  className="py-1.5 px-2 rounded-lg text-xs font-bold bg-red-600 hover:bg-red-700 text-white disabled:opacity-40 disabled:cursor-not-allowed transition flex items-center justify-center gap-1"
                >
                  ⏹ Stop
                </button>
              </div>
            </div>

            {/* Speech to Text Microphone */}
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-2">
              <div className="text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                <span>Speech-to-Text Search</span>
                <span className="text-[10px] text-slate-400">Mic</span>
              </div>
              <button
                onClick={handleToggleListening}
                className={`w-full py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition ${
                  isListening
                    ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse'
                    : 'bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-100'
                }`}
              >
                <span>{isListening ? '🔴' : '🎙️'}</span>
                <span>{isListening ? 'Listening... Tap to Stop' : 'Tap to Speak Command'}</span>
              </button>
              {transcript && (
                <div className="text-[11px] text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-900 p-2 rounded border border-slate-200 dark:border-slate-700 italic">
                  "{transcript}"
                </div>
              )}
            </div>
          </div>
        )}

        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center gap-2 px-4 py-3 rounded-full font-bold shadow-xl border transition-all transform hover:scale-105 active:scale-95 ${
            isOpen
              ? 'bg-gov-navy dark:bg-blue-600 text-white border-blue-400'
              : isSpeaking
              ? 'bg-emerald-600 text-white border-emerald-400 animate-pulse'
              : 'bg-white dark:bg-slate-800 text-gov-navy dark:text-blue-400 border-slate-200 dark:border-slate-700 hover:border-gov-navy'
          }`}
          title="Sahayak Voice Assistant"
        >
          <span className="text-xl">🔊</span>
          <span className="text-xs tracking-wide uppercase">Sahayak Voice</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-300 font-extrabold">
            AI
          </span>
        </button>
      </div>
    </>
  );
};
