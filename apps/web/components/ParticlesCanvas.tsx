'use client';

import { useMounted } from '../lib/use-mounted';
import { useEffect, useState } from 'react';

interface ParticlesCanvasProps {
  className?: string;
}

// Функция для определения размера экрана
function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkDesktop = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    
    checkDesktop();
    window.addEventListener('resize', checkDesktop);
    return () => window.removeEventListener('resize', checkDesktop);
  }, []);

  return isDesktop;
}

// Оптимизированные позиции - меньше частиц на десктопе
const getParticlePositions = (isDesktop: boolean) => {
  const count = isDesktop ? 20 : 30; // Меньше на десктопе
  return Array.from({ length: count }, (_, i) => ({
    left: (i * 7.3) % 100,
    top: (i * 11.7) % 100,
    delay: (i * 0.4) % 20,
    duration: 10 + (i * 0.6) % 20,
    x: (i * 7.3) % 100,
    y: (i * 11.7) % 100,
  }));
};

const getLinePositions = (isDesktop: boolean) => {
  const count = isDesktop ? 15 : 20; // Меньше на десктопе
  return Array.from({ length: count }, (_, i) => ({
    left: (i * 13.1) % 100,
    top: (i * 8.9) % 100,
    delay: (i * 0.3) % 10,
    duration: 5 + (i * 0.5) % 10,
    x: (i * 13.1) % 100,
    y: (i * 8.9) % 100,
    rotate: (i * 15) % 360,
  }));
};

const textPositions = Array.from({ length: 6 }, (_, i) => ({
  left: (i * 25.7) % 100,
  top: (i * 18.3) % 100,
  delay: (i * 1.8) % 15,
  duration: 8 + (i * 1.5) % 12,
  x: (i * 25.7) % 100,
  y: (i * 18.3) % 100,
}));

export default function ParticlesCanvas({ className = '' }: ParticlesCanvasProps) {
  const mounted = useMounted();
  const isDesktop = useIsDesktop();

  if (!mounted) {
    return <div className={`absolute inset-0 overflow-hidden ${className}`} />;
  }

  // Получаем оптимизированные позиции в зависимости от размера экрана
  const particlePositions = getParticlePositions(isDesktop);
  const linePositions = getLinePositions(isDesktop);

  // Отключаем частицы на очень больших экранах
  if (typeof window !== 'undefined' && window.innerWidth >= 1920) {
    return <div className={`absolute inset-0 overflow-hidden ${className}`} />;
  }

  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      {/* CSS анимация частиц - оптимизированная */}
      <div className="particles-container">
        {/* Создаем оптимизированное количество частиц */}
        {particlePositions.map((pos, i) => (
          <div
            key={i}
            className="particle"
            style={{
              left: `${pos.left}%`,
              top: `${pos.top}%`,
              animationDelay: `${pos.delay}s`,
              animationDuration: `${pos.duration}s`,
              '--particle-x': `${pos.x}%`,
              '--particle-y': `${pos.y}%`,
            } as React.CSSProperties}
          />
        ))}
        
        {/* Соединительные линии - оптимизированные */}
        {linePositions.map((pos, i) => (
          <div
            key={`line-${i}`}
            className="particle-line"
            style={{
              left: `${pos.left}%`,
              top: `${pos.top}%`,
              animationDelay: `${pos.delay}s`,
              animationDuration: `${pos.duration}s`,
              '--line-x': `${pos.x}%`,
              '--line-y': `${pos.y}%`,
              '--line-rotate': `${pos.rotate}deg`,
            } as React.CSSProperties}
          />
        ))}
        
        {/* Редкие текстовые подписи */}
        {textPositions.map((pos, i) => (
          <div
            key={`text-${i}`}
            className="particle-text"
            style={{
              left: `${pos.left}%`,
              top: `${pos.top}%`,
              animationDelay: `${pos.delay}s`,
              animationDuration: `${pos.duration}s`,
              '--text-x': `${pos.x}%`,
              '--text-y': `${pos.y}%`,
            } as React.CSSProperties}
          >
            {['AI', '01', 'ML', 'NN', 'DL', 'NN'][i % 6]}
          </div>
        ))}
      </div>
    </div>
  );
}
