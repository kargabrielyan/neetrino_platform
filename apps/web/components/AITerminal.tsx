'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, CheckCircle, Loader2 } from 'lucide-react';

interface TerminalLine {
  id: number;
  text: string;
  type: 'command' | 'success' | 'info';
  delay: number;
}

const terminalLines: TerminalLine[] = [
  { id: 1, text: 'neetrino@ai:~$ npm run deploy', type: 'command', delay: 0 },
  { id: 2, text: '✓ Building AI-powered applications...', type: 'success', delay: 1000 },
  { id: 3, text: '✓ Neural networks initialized', type: 'success', delay: 2000 },
  { id: 4, text: '✓ Machine learning models loaded', type: 'success', delay: 3000 },
  { id: 5, text: '✓ Real-time data processing active', type: 'success', delay: 4000 },
  { id: 6, text: '✓ Status: All systems operational', type: 'success', delay: 5000 },
  { id: 7, text: '✓ Ready for next generation development', type: 'success', delay: 6000 },
];

export default function AITerminal() {
  const [visibleLines, setVisibleLines] = useState<TerminalLine[]>([]);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentLineIndex < terminalLines.length) {
        setVisibleLines(prev => [...prev, terminalLines[currentLineIndex]]);
        setCurrentLineIndex(prev => prev + 1);
        setIsTyping(true);
        
        // Останавливаем анимацию печати через 500ms
        setTimeout(() => setIsTyping(false), 500);
      } else {
        // Перезапускаем анимацию через 3 секунды
        setTimeout(() => {
          setVisibleLines([]);
          setCurrentLineIndex(0);
        }, 3000);
      }
    }, currentLineIndex === 0 ? 1000 : 1000);

    return () => clearTimeout(timer);
  }, [currentLineIndex]);

  const getLineIcon = (type: TerminalLine['type']) => {
    switch (type) {
      case 'command':
        return <Terminal className="w-4 h-4 text-primary" />;
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      default:
        return <Loader2 className="w-4 h-4 text-yellow-400 animate-spin" />;
    }
  };

  const getLineColor = (type: TerminalLine['type']) => {
    switch (type) {
      case 'command':
        return 'text-primary';
      case 'success':
        return 'text-green-400';
      default:
        return 'text-yellow-400';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="fixed right-4 top-1/2 -translate-y-1/2 z-10 hidden lg:block"
    >
      <div className="glass rounded-2xl p-4 w-80 max-h-96 overflow-hidden border border-stroke/20">
        {/* Заголовок терминала */}
        <div className="flex items-center gap-2 mb-3 pb-2 border-b border-white/10">
          <div className="flex gap-1">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          <span className="text-xs text-white/60 font-mono ml-2">AI Terminal</span>
        </div>

        {/* Содержимое терминала */}
        <div className="font-mono text-sm space-y-1">
          <AnimatePresence>
            {visibleLines.map((line) => (
              <motion.div
                key={line.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="flex items-center gap-2"
              >
                {getLineIcon(line.type)}
                <span className={getLineColor(line.type)}>
                  {line.text}
                  {isTyping && line.id === visibleLines.length && (
                    <motion.span
                      animate={{ opacity: [1, 0] }}
                      transition={{ duration: 0.5, repeat: Infinity }}
                      className="ml-1"
                    >
                      |
                    </motion.span>
                  )}
                </span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Индикатор активности */}
        <div className="mt-3 pt-2 border-t border-white/10">
          <div className="flex items-center gap-2 text-xs text-white/40">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
            <span>System Active</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
