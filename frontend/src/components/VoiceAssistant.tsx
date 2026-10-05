import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useVoiceAssistant, useSpeechRecognition } from '../lib/useSpeech';

/**
 * Top Header Voice Controls section - Flat Enterprise Standard
 */
export const HeaderVoiceControls: React.FC = () => {
  const { language, t } = useLanguage();
  const { play, pause, stop, isSpeaking, isPaused } = useVoiceAssistant();

  return (
    <div className="flex items-center gap-1 sm:gap-1.5 px-2.5 py-1 rounded-md bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 shadow-sm">
      <span className="text-xs font-semibold text-[#0B3B60] dark:text-blue-400 flex items-center gap-1.5">
        <span className="inline-block h-2 w-2 rounded-full bg-blue-600 dark:bg-blue-400"></span>
        <span className="hidden md:inline font-bold tracking-tight">{t('sahayakVoice')}:</span>
      </span>

      <div className="flex items-center gap-1">
        {/* Play Button */}
        <button
          onClick={() => play(undefined, language)}
          className={`px-2 py-0.5 rounded-md text-[11px] font-semibold transition-colors ${
            isSpeaking
              ? 'bg-emerald-700 text-white'
              : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-600'
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
          className={`px-2 py-0.5 rounded-md text-[11px] font-semibold transition-colors ${
            isPaused
              ? 'bg-amber-600 text-white'
              : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-600 disabled:opacity-40 disabled:cursor-not-allowed'
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
          className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-slate-100 hover:bg-red-50 dark:bg-slate-700 dark:hover:bg-red-950/40 text-red-700 dark:text-red-400 border border-slate-300 dark:border-slate-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
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
 * Fixed Enterprise Voice Assistant at bottom-right of screen
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
      {/* Enterprise Docked Voice Control */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2">
        {isOpen && (
          <div className="w-[calc(100vw-2rem)] sm:w-80 p-4 rounded-md bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 shadow-md mb-2 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2.5">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-md bg-[#0B3B60] text-white flex items-center justify-center text-xs font-bold">
                  🔊
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
                    {t('sahayakVoiceAssistant')}
                  </h4>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                    {t('webSpeechApi')}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-6 h-6 rounded-md flex items-center justify-center text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold"
                aria-label="Close Voice Assistant"
              >
                ✕
              </button>
            </div>

            {/* Play, Pause, Stop Controls */}
            <div className="p-3 rounded-md bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2">
              <div className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                <span>{t('ttsControls')}</span>
                {isSpeaking && (
                  <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                    ● {t('speaking')}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => play(undefined, language)}
                  className={`py-1.5 px-2 rounded-md text-xs font-semibold flex items-center justify-center gap-1 transition-colors ${
                    isSpeaking
                      ? 'bg-emerald-700 text-white'
                      : 'bg-[#0B3B60] hover:bg-[#082b47] text-white'
                  }`}
                >
                  ▶ {t('play')}
                </button>
                <button
                  onClick={pause}
                  disabled={!isSpeaking}
                  className="py-1.5 px-2 rounded-md text-xs font-semibold bg-amber-600 hover:bg-amber-700 text-white disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-1 transition-colors"
                >
                  ⏸ {t('pause')}
                </button>
                <button
                  onClick={stop}
                  disabled={!isSpeaking && !isPaused}
                  className="py-1.5 px-2 rounded-md text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-1 transition-colors"
                >
                  ⏹ {t('stop')}
                </button>
              </div>
            </div>

            {/* Speech to Text Microphone */}
            <div className="p-3 rounded-md bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2">
              <div className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                <span>{t('sttSearch')}</span>
                <span className="text-[10px] text-slate-500 font-mono">{t('mic')}</span>
              </div>
              <button
                onClick={handleToggleListening}
                className={`w-full py-2 px-3 rounded-md text-xs font-semibold flex items-center justify-center gap-2 border transition-colors ${
                  isListening
                    ? 'bg-red-700 text-white border-red-800'
                    : 'bg-white hover:bg-slate-100 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-100 border-slate-300 dark:border-slate-600'
                }`}
              >
                <span>{isListening ? '■' : '🎙️'}</span>
                <span>{isListening ? t('listeningTapToStop') : t('tapToSpeak')}</span>
              </button>
              {transcript && (
                <div className="text-[11px] text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 p-2 rounded-md border border-slate-200 dark:border-slate-700 font-mono">
                  "{transcript}"
                </div>
              )}
            </div>
          </div>
        )}

        {/* Enterprise Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-md font-semibold text-xs border shadow-sm transition-colors ${
            isOpen
              ? 'bg-[#082b47] text-white border-[#0B3B60]'
              : isSpeaking
              ? 'bg-emerald-700 text-white border-emerald-800'
              : 'bg-[#0B3B60] hover:bg-[#082b47] text-white border-[#0B3B60]'
          }`}
          title="Sahayak Voice Accessibility Assistant"
        >
          <span className="inline-block h-2 w-2 rounded-full bg-blue-300"></span>
          <span>🔊</span>
          <span className="tracking-wide uppercase hidden sm:inline">{t('sahayakVoice')}</span>
          <span className="bg-blue-700 text-white font-bold px-1.5 py-0.2 rounded text-[10px] uppercase">
            Access
          </span>
        </button>
      </div>
    </>
  );
};
