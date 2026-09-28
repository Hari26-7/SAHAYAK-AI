import React, { createContext, useContext, useState, useEffect } from 'react';

export type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  toggleTheme: () => {},
  setTheme: () => {},
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Read initial preference from localStorage.theme, falling back to document class or light
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme') as Theme | null;
      if (savedTheme === 'light' || savedTheme === 'dark') {
        return savedTheme;
      }
      const sihTheme = localStorage.getItem('sih_msme_theme') as Theme | null;
      if (sihTheme === 'light' || sihTheme === 'dark') {
        return sihTheme;
      }
      return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
    }
    return 'light';
  });

  // Wrapped in a useEffect hook to synchronize with document.documentElement and localStorage.theme
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      document.body?.classList.add('dark');
    } else {
      root.classList.remove('dark');
      document.body?.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
    localStorage.setItem('sih_msme_theme', theme);
  }, [theme]);

  // Robust toggle function that explicitly toggles the dark class on root HTML element
  const toggleTheme = () => {
    const isDark = document.documentElement.classList.toggle('dark');
    const nextTheme: Theme = isDark ? 'dark' : 'light';
    setThemeState(nextTheme);
    localStorage.setItem('theme', nextTheme);
    localStorage.setItem('sih_msme_theme', nextTheme);
    if (nextTheme === 'dark') {
      document.body?.classList.add('dark');
    } else {
      document.body?.classList.remove('dark');
    }
  };

  const setTheme = (newTheme: Theme) => {
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
      document.body?.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body?.classList.remove('dark');
    }
    setThemeState(newTheme);
    localStorage.setItem('theme', newTheme);
    localStorage.setItem('sih_msme_theme', newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
