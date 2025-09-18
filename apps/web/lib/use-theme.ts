'use client';

import { useState, useEffect } from 'react';

export function useTheme() {
  const [isDark, setIsDark] = useState<boolean>(() => {
    // Initialize with saved theme or default to light
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme) {
        return savedTheme === 'dark';
      }
      // Default to light theme
      return false;
    }
    return false;
  });

  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Apply theme immediately on mount
    const html = document.documentElement;
    if (isDark) {
      html.classList.add('dark');
      html.classList.remove('light');
    } else {
      html.classList.add('light');
      html.classList.remove('dark');
    }
    
    // Save preference
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    setIsLoaded(true);
  }, [isDark]);

  // Listen for storage changes (when theme is changed in another tab)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'theme') {
        setIsDark(e.newValue === 'dark');
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  return { isDark, toggleTheme, isLoaded };
}
