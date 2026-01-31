
import { useCallback, useState, useEffect } from 'react';
import { Language } from '../types';

export function useSpeech() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);

  useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      setAvailableVoices(voices);
    };

    loadVoices();
    // Some browsers fire onvoiceschanged only once, others multiple times.
    // Some browsers don't fire it if voices are already loaded.
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = loadVoices;
    }


    return () => {
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = null;
      }
      window.speechSynthesis.cancel(); 
    };
  }, []);

  const speak = useCallback((text: string, lang: Language) => {
    if (!window.speechSynthesis) {
      console.warn('Speech Synthesis not supported by this browser.');
      return;
    }

    // Cancel any ongoing or pending speech immediately.
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    
    const targetLangCode = lang === Language.AR ? 'ar' : 'en';
    // Prioritize local voices first, then any voice matching the language prefix.
    let voice = availableVoices.find(v => v.lang.startsWith(targetLangCode) && v.localService);
    if (!voice) {
        voice = availableVoices.find(v => v.lang.startsWith(targetLangCode));
    }
    // Fallback for English if a generic 'en' voice wasn't found but specific locales exist
    if(!voice && targetLangCode === 'en'){ 
        voice = availableVoices.find(v => v.lang.startsWith('en-US') || v.lang.startsWith('en-GB'));
    }

    if (voice) {
      utterance.voice = voice;
    } else {
      console.warn(`No specific voice found for language code: ${targetLangCode} (requested ${lang}). Using browser default for this language if available.`);
    }
    
    // Set the lang attribute on the utterance. This helps the browser pick a default voice if one isn't explicitly set.
    utterance.lang = lang === Language.AR ? 'ar-SA' : 'en-US'; // Using specific locales can sometimes improve voice selection
    utterance.pitch = 1; 
    utterance.rate = 0.9;  // Slightly slower can improve clarity for young learners

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = (event: SpeechSynthesisErrorEvent) => {
      // FIX: Corrected typo in error string "cancelled" to "canceled"
      if (event.error === 'interrupted' || event.error === 'canceled') {
        // These are often expected outcomes when speech is deliberately stopped or superseded.
        // Log as info to reduce console noise from "errors" that are part of the flow.
        console.info(`SpeechSynthesisUtterance: Utterance event '${event.error}'. Text: "${utterance.text}"`, event);
      } else {
        // Log other errors as actual errors.
        console.error(`SpeechSynthesisUtterance.onerror - Error code: ${event.error}`, 'Utterance text:', utterance.text, 'Event:', event);
      }
      setIsSpeaking(false);
    };

    window.speechSynthesis.speak(utterance);
  }, [availableVoices]);

  const cancelSpeech = useCallback(() => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false); // Assume cancellation will stop speech
    }
  }, []);

  return { speak, cancelSpeech, isSpeaking, availableVoices };
}