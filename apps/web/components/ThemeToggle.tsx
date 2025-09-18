'use client';

import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../lib/use-theme';

export default function ThemeToggle() {
  const { isDark, toggleTheme, isLoaded } = useTheme();

  // Don't render until theme is loaded to prevent flash
  if (!isLoaded) {
    return (
      <div className="glass-subtle p-2 rounded-full text-ink/70">
        <div className="w-5 h-5" />
      </div>
    );
  }

  return (
    <motion.button
      onClick={toggleTheme}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="glass-subtle p-2 rounded-full text-ink/70 hover:text-ink transition-colors focus-ring"
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <motion.div
        initial={false}
        animate={{ rotate: isDark ? 180 : 0 }}
        transition={{ duration: 0.3 }}
      >
        {isDark ? (
          <Sun className="w-5 h-5" />
        ) : (
          <Moon className="w-5 h-5" />
        )}
      </motion.div>
    </motion.button>
  );
}