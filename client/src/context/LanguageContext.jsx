import React, { createContext, useContext, useState, useEffect } from 'react';

/* ─── Language ─── */
const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem('siteLang') || 'en');
  const toggleLang = () => {
    const next = lang === 'en' ? 'bn' : 'en';
    setLang(next);
    localStorage.setItem('siteLang', next);
  };

  /* ─── Theme (light by default) ─── */
  const [theme, setTheme] = useState(() => localStorage.getItem('siteTheme') || 'light');

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('siteTheme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(t => (t === 'dark' ? 'light' : 'dark'));

  return (
    <LanguageContext.Provider value={{ lang, toggleLang, theme, toggleTheme }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLang() {
  return useContext(LanguageContext);
}
