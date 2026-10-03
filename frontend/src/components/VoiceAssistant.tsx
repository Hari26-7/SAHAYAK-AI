import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useVoiceAssistant, useSpeechRecognition } from '../lib/useSpeech';

/**
 * Top Header Voice Controls section
 */
export const HeaderVoiceControls: React.FC = () => {
  const { language, t } = useLanguage();
  const { play, pause, stop, isSpeaking, isPaused } = useVoiceAssistant();

  return (
    <div className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1 rounded-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border border-slate-200/60 dark:border-slate-700/60 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] transition-all duration-300">
      <span className="text-xs font-bold text-[#0B3B60] dark:text-blue-400 flex items-center gap-1">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600 dark:bg-blue-400"></span>
        </span>
        <span className="hidden md:inline font-black tracking-tight">{t('sahayakVoice')}:</span>
      </span>

      <div className="flex items-center gap-1">
        {/* Play Button */}
        <button
          onClick={() => play(undefined, language)}
          className={`px-2 py-0.5 rounded-lg text-[10px] sm:text-[11px] font-bold transition-all duration-300 ease-out hover:-translate-y-0.5 active:translate-y-0 ${
            isSpeaking
              ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-500/30 animate-pulse'
              : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600'
          }`}
          title="Read Current Page Aloud"
        >
          <span>▶</span>
          <span className="hidden md:inline ml-1">{t('play')}</span>
        </button>

        {/* Pause Button */}
        <button
          onClick={pause}
          disabled={!isSpeaking}
          className={`px-2 py-0.5 rounded-lg text-[10px] sm:text-[11px] font-bold transition-all duration-300 ease-out hover:-translate-y-0.5 active:translate-y-0 ${
            isPaused
              ? 'bg-amber-600 text-white shadow-md shadow-amber-500/30'
              : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600 disabled:opacity-40 disabled:cursor-not-allowed'
          }`}
          title="Pause Reading"
        >
          <span>⏸</span>
          <span className="hidden md:inline ml-1">{t('pause')}</span>
        </button>

        {/* Stop Button */}
        <button
          onClick={stop}
          disabled={!isSpeaking && !isPaused}
          className="px-2 py-0.5 rounded-lg text-[10px] sm:text-[11px] font-bold bg-slate-100 hover:bg-red-50 dark:bg-slate-700 dark:hover:bg-red-950/40 text-red-600 dark:text-red-400 border border-slate-200 dark:border-slate-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300 ease-out hover:-translate-y-0.5 active:translate-y-0"
          title="Stop Reading"
        >
          <span>⏹</span>
          <span className="hidden md:inline ml-1">{t('stop')}</span>
        </button>
      </div>
    </div>
  );
};

/**
 * Fixed Floating Voice Assistant at bottom-right of screen
 */
export const VoiceAssistant: React.FC = () => {
  const { language, t } = useLanguage();
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
      <div className="fixed bottom-20 md:bottom-6 right-4 md:right-6 z-40 flex flex-col items-end gap-2">
        {isOpen && (
          <div className="w-[calc(100vw-2rem)] sm:w-80 p-5 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200/60 dark:border-slate-700/60 shadow-[0_8px_30px_rgb(0,0,0,0.12)] mb-2 animate-in fade-in duration-300 slide-in-from-bottom-4 space-y-3.5">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center text-sm shadow-md shadow-indigo-500/30">
                  🔊
                </div>
                <div>
                  <h4 className="text-xs font-black text-[#0B3B60] dark:text-blue-400 uppercase tracking-wider">
                    {t('sahayakVoiceAssistant')}
                  </h4>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                    {t('webSpeechApi')}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-6 h-6 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold transition-all"
              >
                ✕
              </button>
            </div>

            {/* Play, Pause, Stop Controls */}
            <div className="p-3 rounded-xl bg-slate-50/80 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 space-y-2.5">
              <div className="text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                <span>{t('ttsControls')}</span>
                {isSpeaking && (
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold animate-pulse flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                    ● {t('speaking')}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => play(undefined, language)}
                  className={`py-2 px-2 rounded-xl text-xs font-bold transition-all duration-300 ease-out hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-1 shadow-sm ${
                    isSpeaking
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-emerald-500/30'
                      : 'bg-[#0B3B60] dark:bg-blue-600 hover:bg-[#082b47] text-white'
                  }`}
                >
                  ▶ {t('play')}
                </button>
                <button
                  onClick={pause}
                  disabled={!isSpeaking}
                  className="py-2 px-2 rounded-xl text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300 ease-out hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-1 shadow-sm"
                >
                  ⏸ {t('pause')}
                </button>
                <button
                  onClick={stop}
                  disabled={!isSpeaking && !isPaused}
                  className="py-2 px-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300 ease-out hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-1 shadow-sm"
                >
                  ⏹ {t('stop')}
                </button>
              </div>
            </div>

            {/* Speech to Text Microphone */}
            <div className="p-3 rounded-xl bg-slate-50/80 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 space-y-2">
              <div className="text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                <span>{t('sttSearch')}</span>
                <span className="text-[10px] text-slate-400 font-mono">{t('mic')}</span>
              </div>
              <button
                onClick={handleToggleListening}
                className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all duration-300 ease-out hover:-translate-y-0.5 active:translate-y-0 shadow-md ${
                  isListening
                    ? 'bg-gradient-to-r from-red-500 to-rose-600 text-white ring-4 ring-rose-400/40 animate-pulse'
                    : 'bg-white hover:bg-slate-100 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-600'
                }`}
              >
                <span>{isListening ? '🔴' : '🎙️'}</span>
                <span>{isListening ? t('listeningTapToStop') : t('tapToSpeak')}</span>
              </button>
              {transcript && (
                <div className="text-[11px] text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 italic">
                  "{transcript}"
                </div>
              )}
            </div>
          </div>
        )}

        {/* Pulse / Ring Living Voice Assistant Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center gap-2 px-4 py-3 rounded-full font-extrabold shadow-xl border transition-all duration-300 ease-out hover:-translate-y-1 transform active:scale-95 ring-2 ring-blue-400/50 dark:ring-blue-500/50 hover:ring-4 hover:ring-blue-400/80 shadow-indigo-500/20 ${
            isOpen
              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-transparent'
              : isSpeaking
              ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white border-transparent animate-pulse ring-4 ring-emerald-400/60'
              : 'bg-white/90 dark:bg-slate-800/90 backdrop-blur-md text-[#0B3B60] dark:text-blue-400 border-slate-200/80 dark:border-slate-700/80 hover:border-blue-400 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.15)]'
          }`}
          title="Sahayak Voice Assistant (AI Copilot)"
        >
          {/* Subtle live indicator dot */}
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-600 dark:bg-blue-400"></span>
          </span>
          <span className="text-lg sm:text-xl">🔊</span>
          <span className="text-xs tracking-wider uppercase hidden sm:inline">{t('sahayakVoice')}</span>
          <span className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold px-2 py-0.5 rounded-full shadow-md shadow-indigo-500/30 text-[10px]">
            AI
          </span>
        </button>
      </div>
    </>
  );
};
