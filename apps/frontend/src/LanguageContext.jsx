import React, { createContext, useState, useContext, useEffect } from 'react';
import { locales } from './locales';

const LanguageContext = createContext();

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState('en');
  const [isReading, setIsReading] = useState(false);

  const t = locales[lang];

  // Speech Synthesis for Audio Assistance
  const speak = (text) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Attempt to set locale specific voices
    if (lang === 'hi') utterance.lang = 'hi-IN';
    else if (lang === 'bn') utterance.lang = 'bn-IN';
    else utterance.lang = 'en-IN';

    utterance.onend = () => setIsReading(false);
    
    setIsReading(true);
    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsReading(false);
    }
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, speak, stopSpeaking, isReading }}>
      {children}
    </LanguageContext.Provider>
  );
};
