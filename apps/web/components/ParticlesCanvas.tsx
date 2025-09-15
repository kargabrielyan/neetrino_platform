'use client';

interface ParticlesCanvasProps {
  className?: string;
}

export default function ParticlesCanvas({ className = '' }: ParticlesCanvasProps) {
  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      {/* CSS анимация частиц */}
      <div className="particles-container">
        {/* Создаем множество частиц */}
        {Array.from({ length: 50 }).map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 20}s`,
              animationDuration: `${10 + Math.random() * 20}s`,
            }}
          />
        ))}
        
        {/* Соединительные линии */}
        {Array.from({ length: 30 }).map((_, i) => (
          <div
            key={`line-${i}`}
            className="particle-line"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 10}s`,
              animationDuration: `${5 + Math.random() * 10}s`,
            }}
          />
        ))}
        
        {/* Редкие текстовые подписи */}
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={`text-${i}`}
            className="particle-text"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 15}s`,
              animationDuration: `${8 + Math.random() * 12}s`,
            }}
          >
            {['AI', '01', 'ML', 'NN'][i % 4]}
          </div>
        ))}
      </div>
    </div>
  );
}
