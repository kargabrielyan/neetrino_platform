'use client';

import { useMounted } from '../lib/use-mounted';

interface ParticlesCanvasProps {
  className?: string;
}

// Предопределенные позиции для избежания проблем с гидратацией
const particlePositions = Array.from({ length: 50 }, (_, i) => ({
  left: (i * 7.3) % 100,
  top: (i * 11.7) % 100,
  delay: (i * 0.4) % 20,
  duration: 10 + (i * 0.6) % 20,
}));

const linePositions = Array.from({ length: 30 }, (_, i) => ({
  left: (i * 13.1) % 100,
  top: (i * 8.9) % 100,
  delay: (i * 0.3) % 10,
  duration: 5 + (i * 0.5) % 10,
}));

const textPositions = Array.from({ length: 8 }, (_, i) => ({
  left: (i * 25.7) % 100,
  top: (i * 18.3) % 100,
  delay: (i * 1.8) % 15,
  duration: 8 + (i * 1.5) % 12,
}));

export default function ParticlesCanvas({ className = '' }: ParticlesCanvasProps) {
  const mounted = useMounted();

  if (!mounted) {
    return <div className={`absolute inset-0 overflow-hidden ${className}`} />;
  }

  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      {/* CSS анимация частиц */}
      <div className="particles-container">
        {/* Создаем множество частиц */}
        {particlePositions.map((pos, i) => (
          <div
            key={i}
            className="particle"
            style={{
              left: `${pos.left}%`,
              top: `${pos.top}%`,
              animationDelay: `${pos.delay}s`,
              animationDuration: `${pos.duration}s`,
            }}
          />
        ))}
        
        {/* Соединительные линии */}
        {linePositions.map((pos, i) => (
          <div
            key={`line-${i}`}
            className="particle-line"
            style={{
              left: `${pos.left}%`,
              top: `${pos.top}%`,
              animationDelay: `${pos.delay}s`,
              animationDuration: `${pos.duration}s`,
            }}
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
            }}
          >
            {['AI', '01', 'ML', 'NN'][i % 4]}
          </div>
        ))}
      </div>
    </div>
  );
}
