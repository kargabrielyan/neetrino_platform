'use client';

import { motion } from 'framer-motion';

export default function NNArchitecture() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const nodeVariants = {
    hidden: { opacity: 0, scale: 0 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: 'easeOut',
      },
    },
  };

  const lineVariants = {
    hidden: { pathLength: 0 },
    visible: {
      pathLength: 1,
      transition: {
        duration: 1,
        ease: 'easeInOut',
      },
    },
  };

  return (
    <div className="w-full h-96 flex items-center justify-center">
      <motion.svg
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        width="100%"
        height="100%"
        viewBox="0 0 500 400"
        className="overflow-visible"
      >
        {/* Соединительные линии */}
        <motion.path
          variants={lineVariants}
          d="M 80 200 L 150 120"
          stroke="#00D1FF"
          strokeWidth="3"
          fill="none"
          opacity="0.7"
        />
        <motion.path
          variants={lineVariants}
          d="M 80 200 L 150 200"
          stroke="#00D1FF"
          strokeWidth="3"
          fill="none"
          opacity="0.7"
        />
        <motion.path
          variants={lineVariants}
          d="M 80 200 L 150 280"
          stroke="#00D1FF"
          strokeWidth="3"
          fill="none"
          opacity="0.7"
        />
        
        <motion.path
          variants={lineVariants}
          d="M 220 120 L 290 120"
          stroke="#00D1FF"
          strokeWidth="3"
          fill="none"
          opacity="0.7"
        />
        <motion.path
          variants={lineVariants}
          d="M 220 120 L 290 200"
          stroke="#00D1FF"
          strokeWidth="3"
          fill="none"
          opacity="0.7"
        />
        <motion.path
          variants={lineVariants}
          d="M 220 200 L 290 120"
          stroke="#00D1FF"
          strokeWidth="3"
          fill="none"
          opacity="0.7"
        />
        <motion.path
          variants={lineVariants}
          d="M 220 200 L 290 200"
          stroke="#00D1FF"
          strokeWidth="3"
          fill="none"
          opacity="0.7"
        />
        <motion.path
          variants={lineVariants}
          d="M 220 200 L 290 280"
          stroke="#00D1FF"
          strokeWidth="3"
          fill="none"
          opacity="0.7"
        />
        <motion.path
          variants={lineVariants}
          d="M 220 280 L 290 200"
          stroke="#00D1FF"
          strokeWidth="3"
          fill="none"
          opacity="0.7"
        />
        <motion.path
          variants={lineVariants}
          d="M 220 280 L 290 280"
          stroke="#00D1FF"
          strokeWidth="3"
          fill="none"
          opacity="0.7"
        />
        
        <motion.path
          variants={lineVariants}
          d="M 360 120 L 420 200"
          stroke="#00D1FF"
          strokeWidth="3"
          fill="none"
          opacity="0.7"
        />
        <motion.path
          variants={lineVariants}
          d="M 360 200 L 420 200"
          stroke="#00D1FF"
          strokeWidth="3"
          fill="none"
          opacity="0.7"
        />
        <motion.path
          variants={lineVariants}
          d="M 360 280 L 420 200"
          stroke="#00D1FF"
          strokeWidth="3"
          fill="none"
          opacity="0.7"
        />

        {/* Входной слой */}
        <motion.circle
          variants={nodeVariants}
          cx="80"
          cy="200"
          r="25"
          fill="rgba(0, 209, 255, 0.3)"
          stroke="#00D1FF"
          strokeWidth="3"
        />
        <motion.text
          variants={nodeVariants}
          x="80"
          y="205"
          textAnchor="middle"
          className="fill-white text-sm font-mono font-semibold"
        >
          Input
        </motion.text>

        {/* Скрытый слой 1 */}
        <motion.circle
          variants={nodeVariants}
          cx="150"
          cy="120"
          r="18"
          fill="rgba(255, 154, 62, 0.3)"
          stroke="#FF9A3E"
          strokeWidth="3"
        />
        <motion.circle
          variants={nodeVariants}
          cx="150"
          cy="200"
          r="18"
          fill="rgba(255, 154, 62, 0.3)"
          stroke="#FF9A3E"
          strokeWidth="3"
        />
        <motion.circle
          variants={nodeVariants}
          cx="150"
          cy="280"
          r="18"
          fill="rgba(255, 154, 62, 0.3)"
          stroke="#FF9A3E"
          strokeWidth="3"
        />

        {/* Скрытый слой 2 */}
        <motion.circle
          variants={nodeVariants}
          cx="220"
          cy="120"
          r="18"
          fill="rgba(0, 209, 255, 0.3)"
          stroke="#00D1FF"
          strokeWidth="3"
        />
        <motion.circle
          variants={nodeVariants}
          cx="220"
          cy="200"
          r="18"
          fill="rgba(0, 209, 255, 0.3)"
          stroke="#00D1FF"
          strokeWidth="3"
        />
        <motion.circle
          variants={nodeVariants}
          cx="220"
          cy="280"
          r="18"
          fill="rgba(0, 209, 255, 0.3)"
          stroke="#00D1FF"
          strokeWidth="3"
        />

        {/* Скрытый слой 3 */}
        <motion.circle
          variants={nodeVariants}
          cx="290"
          cy="120"
          r="18"
          fill="rgba(255, 154, 62, 0.3)"
          stroke="#FF9A3E"
          strokeWidth="3"
        />
        <motion.circle
          variants={nodeVariants}
          cx="290"
          cy="200"
          r="18"
          fill="rgba(255, 154, 62, 0.3)"
          stroke="#FF9A3E"
          strokeWidth="3"
        />
        <motion.circle
          variants={nodeVariants}
          cx="290"
          cy="280"
          r="18"
          fill="rgba(255, 154, 62, 0.3)"
          stroke="#FF9A3E"
          strokeWidth="3"
        />

        {/* Выходной слой */}
        <motion.circle
          variants={nodeVariants}
          cx="420"
          cy="200"
          r="25"
          fill="rgba(0, 209, 255, 0.3)"
          stroke="#00D1FF"
          strokeWidth="3"
        />
        <motion.text
          variants={nodeVariants}
          x="420"
          y="205"
          textAnchor="middle"
          className="fill-white text-sm font-mono font-semibold"
        >
          Output
        </motion.text>

        {/* Подписи слоев */}
        <motion.text
          variants={nodeVariants}
          x="80"
          y="240"
          textAnchor="middle"
          className="fill-white/60 text-xs font-mono"
        >
          Input Layer
        </motion.text>
        
        <motion.text
          variants={nodeVariants}
          x="150"
          y="310"
          textAnchor="middle"
          className="fill-white/60 text-xs font-mono"
        >
          Hidden Layer 1
        </motion.text>
        
        <motion.text
          variants={nodeVariants}
          x="220"
          y="310"
          textAnchor="middle"
          className="fill-white/60 text-xs font-mono"
        >
          Hidden Layer 2
        </motion.text>
        
        <motion.text
          variants={nodeVariants}
          x="290"
          y="310"
          textAnchor="middle"
          className="fill-white/60 text-xs font-mono"
        >
          Hidden Layer 3
        </motion.text>
        
        <motion.text
          variants={nodeVariants}
          x="420"
          y="240"
          textAnchor="middle"
          className="fill-white/60 text-xs font-mono"
        >
          Output Layer
        </motion.text>

        {/* Анимированные точки на линиях */}
        <motion.circle
          variants={nodeVariants}
          cx="115"
          cy="160"
          r="3"
          fill="#00D1FF"
          opacity="0.8"
        >
          <motion.animate
            attributeName="opacity"
            values="0.8;0.2;0.8"
            dur="2s"
            repeatCount="indefinite"
          />
        </motion.circle>
        
        <motion.circle
          variants={nodeVariants}
          cx="185"
          cy="160"
          r="3"
          fill="#FF9A3E"
          opacity="0.8"
        >
          <motion.animate
            attributeName="opacity"
            values="0.2;0.8;0.2"
            dur="2s"
            repeatCount="indefinite"
          />
        </motion.circle>
        
        <motion.circle
          variants={nodeVariants}
          cx="355"
          cy="160"
          r="3"
          fill="#00D1FF"
          opacity="0.8"
        >
          <motion.animate
            attributeName="opacity"
            values="0.8;0.2;0.8"
            dur="2s"
            repeatCount="indefinite"
          />
        </motion.circle>
      </motion.svg>
    </div>
  );
}
