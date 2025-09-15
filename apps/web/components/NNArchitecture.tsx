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
    <div className="w-full h-80 flex items-center justify-center">
      <motion.svg
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        width="100%"
        height="100%"
        viewBox="0 0 400 300"
        className="overflow-visible"
      >
        {/* Соединительные линии */}
        <motion.path
          variants={lineVariants}
          d="M 50 150 L 120 100"
          stroke="#00D1FF"
          strokeWidth="2"
          fill="none"
          opacity="0.6"
        />
        <motion.path
          variants={lineVariants}
          d="M 50 150 L 120 150"
          stroke="#00D1FF"
          strokeWidth="2"
          fill="none"
          opacity="0.6"
        />
        <motion.path
          variants={lineVariants}
          d="M 50 150 L 120 200"
          stroke="#00D1FF"
          strokeWidth="2"
          fill="none"
          opacity="0.6"
        />
        
        <motion.path
          variants={lineVariants}
          d="M 180 100 L 250 100"
          stroke="#00D1FF"
          strokeWidth="2"
          fill="none"
          opacity="0.6"
        />
        <motion.path
          variants={lineVariants}
          d="M 180 100 L 250 150"
          stroke="#00D1FF"
          strokeWidth="2"
          fill="none"
          opacity="0.6"
        />
        <motion.path
          variants={lineVariants}
          d="M 180 150 L 250 100"
          stroke="#00D1FF"
          strokeWidth="2"
          fill="none"
          opacity="0.6"
        />
        <motion.path
          variants={lineVariants}
          d="M 180 150 L 250 150"
          stroke="#00D1FF"
          strokeWidth="2"
          fill="none"
          opacity="0.6"
        />
        <motion.path
          variants={lineVariants}
          d="M 180 150 L 250 200"
          stroke="#00D1FF"
          strokeWidth="2"
          fill="none"
          opacity="0.6"
        />
        <motion.path
          variants={lineVariants}
          d="M 180 200 L 250 150"
          stroke="#00D1FF"
          strokeWidth="2"
          fill="none"
          opacity="0.6"
        />
        <motion.path
          variants={lineVariants}
          d="M 180 200 L 250 200"
          stroke="#00D1FF"
          strokeWidth="2"
          fill="none"
          opacity="0.6"
        />
        
        <motion.path
          variants={lineVariants}
          d="M 320 100 L 350 150"
          stroke="#00D1FF"
          strokeWidth="2"
          fill="none"
          opacity="0.6"
        />
        <motion.path
          variants={lineVariants}
          d="M 320 150 L 350 150"
          stroke="#00D1FF"
          strokeWidth="2"
          fill="none"
          opacity="0.6"
        />
        <motion.path
          variants={lineVariants}
          d="M 320 200 L 350 150"
          stroke="#00D1FF"
          strokeWidth="2"
          fill="none"
          opacity="0.6"
        />

        {/* Входной слой */}
        <motion.circle
          variants={nodeVariants}
          cx="50"
          cy="150"
          r="20"
          fill="rgba(0, 209, 255, 0.2)"
          stroke="#00D1FF"
          strokeWidth="2"
        />
        <motion.text
          variants={nodeVariants}
          x="50"
          y="155"
          textAnchor="middle"
          className="fill-white text-sm font-mono"
        >
          Input
        </motion.text>

        {/* Скрытый слой 1 */}
        <motion.circle
          variants={nodeVariants}
          cx="120"
          cy="100"
          r="15"
          fill="rgba(255, 154, 62, 0.2)"
          stroke="#FF9A3E"
          strokeWidth="2"
        />
        <motion.circle
          variants={nodeVariants}
          cx="120"
          cy="150"
          r="15"
          fill="rgba(255, 154, 62, 0.2)"
          stroke="#FF9A3E"
          strokeWidth="2"
        />
        <motion.circle
          variants={nodeVariants}
          cx="120"
          cy="200"
          r="15"
          fill="rgba(255, 154, 62, 0.2)"
          stroke="#FF9A3E"
          strokeWidth="2"
        />

        {/* Скрытый слой 2 */}
        <motion.circle
          variants={nodeVariants}
          cx="180"
          cy="100"
          r="15"
          fill="rgba(0, 209, 255, 0.2)"
          stroke="#00D1FF"
          strokeWidth="2"
        />
        <motion.circle
          variants={nodeVariants}
          cx="180"
          cy="150"
          r="15"
          fill="rgba(0, 209, 255, 0.2)"
          stroke="#00D1FF"
          strokeWidth="2"
        />
        <motion.circle
          variants={nodeVariants}
          cx="180"
          cy="200"
          r="15"
          fill="rgba(0, 209, 255, 0.2)"
          stroke="#00D1FF"
          strokeWidth="2"
        />

        {/* Скрытый слой 3 */}
        <motion.circle
          variants={nodeVariants}
          cx="250"
          cy="100"
          r="15"
          fill="rgba(255, 154, 62, 0.2)"
          stroke="#FF9A3E"
          strokeWidth="2"
        />
        <motion.circle
          variants={nodeVariants}
          cx="250"
          cy="150"
          r="15"
          fill="rgba(255, 154, 62, 0.2)"
          stroke="#FF9A3E"
          strokeWidth="2"
        />
        <motion.circle
          variants={nodeVariants}
          cx="250"
          cy="200"
          r="15"
          fill="rgba(255, 154, 62, 0.2)"
          stroke="#FF9A3E"
          strokeWidth="2"
        />

        {/* Выходной слой */}
        <motion.circle
          variants={nodeVariants}
          cx="350"
          cy="150"
          r="20"
          fill="rgba(0, 209, 255, 0.2)"
          stroke="#00D1FF"
          strokeWidth="2"
        />
        <motion.text
          variants={nodeVariants}
          x="350"
          y="155"
          textAnchor="middle"
          className="fill-white text-sm font-mono"
        >
          Output
        </motion.text>

        {/* Подписи слоев */}
        <motion.text
          variants={nodeVariants}
          x="50"
          y="190"
          textAnchor="middle"
          className="fill-white/60 text-xs font-mono"
        >
          Input Layer
        </motion.text>
        
        <motion.text
          variants={nodeVariants}
          x="120"
          y="230"
          textAnchor="middle"
          className="fill-white/60 text-xs font-mono"
        >
          Hidden Layer 1
        </motion.text>
        
        <motion.text
          variants={nodeVariants}
          x="180"
          y="230"
          textAnchor="middle"
          className="fill-white/60 text-xs font-mono"
        >
          Hidden Layer 2
        </motion.text>
        
        <motion.text
          variants={nodeVariants}
          x="250"
          y="230"
          textAnchor="middle"
          className="fill-white/60 text-xs font-mono"
        >
          Hidden Layer 3
        </motion.text>
        
        <motion.text
          variants={nodeVariants}
          x="350"
          y="190"
          textAnchor="middle"
          className="fill-white/60 text-xs font-mono"
        >
          Output Layer
        </motion.text>

        {/* Анимированные точки на линиях */}
        <motion.circle
          variants={nodeVariants}
          cx="85"
          cy="125"
          r="2"
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
          cx="150"
          cy="125"
          r="2"
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
          cx="285"
          cy="125"
          r="2"
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
