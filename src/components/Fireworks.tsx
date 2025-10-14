'use client';

import { motion } from 'framer-motion';
import { Heart, Sparkles, Star, Flower } from 'lucide-react';

interface FireworkProps {
  delay: number;
  x: number;
  y: number;
  color: string;
  icon: React.ComponentType<{ className?: string }>;
}

const Firework = ({ delay, x, y, color, icon: Icon }: FireworkProps) => {
  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{ left: `${x}%`, top: `${y}%` }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ 
        scale: [0, 1.5, 0.8, 1.2, 0],
        opacity: [0, 1, 0.8, 0.6, 0],
        rotate: [0, 180, 360]
      }}
      transition={{
        delay,
        duration: 2,
        ease: "easeOut"
      }}
    >
      <motion.div
        animate={{
          y: [-20, -40, -60, -80],
          x: [0, 10, -10, 0],
          scale: [1, 1.2, 0.8, 0]
        }}
        transition={{
          duration: 2,
          ease: "easeOut"
        }}
      >
        <Icon className={`w-8 h-8 ${color} drop-shadow-lg`} />
      </motion.div>
      
      {/* Các tia sáng xung quanh */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{
            transformOrigin: 'center',
            transform: `rotate(${i * 45}deg)`
          }}
          animate={{
            x: [0, 30, 0],
            y: [0, 30, 0],
            opacity: [0, 1, 0],
            scale: [0, 1, 0]
          }}
          transition={{
            delay: delay + 0.2,
            duration: 1.5,
            ease: "easeOut"
          }}
        >
          <Sparkles className={`w-3 h-3 ${color}`} />
        </motion.div>
      ))}
    </motion.div>
  );
};

export default function Fireworks() {
  const fireworks = [
    { delay: 0, x: 20, y: 30, color: 'text-pink-400', icon: Heart },
    { delay: 0.2, x: 80, y: 25, color: 'text-rose-400', icon: Star },
    { delay: 0.4, x: 50, y: 20, color: 'text-pink-300', icon: Flower },
    { delay: 0.6, x: 30, y: 40, color: 'text-rose-300', icon: Sparkles },
    { delay: 0.8, x: 70, y: 35, color: 'text-pink-500', icon: Heart },
    { delay: 1, x: 15, y: 50, color: 'text-rose-500', icon: Star },
    { delay: 1.2, x: 85, y: 45, color: 'text-pink-400', icon: Flower },
    { delay: 1.4, x: 60, y: 60, color: 'text-rose-400', icon: Sparkles },
    { delay: 1.6, x: 40, y: 15, color: 'text-pink-300', icon: Heart },
    { delay: 1.8, x: 90, y: 55, color: 'text-rose-300', icon: Star }
  ];

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {fireworks.map((firework, index) => (
        <Firework
          key={index}
          delay={firework.delay}
          x={firework.x}
          y={firework.y}
          color={firework.color}
          icon={firework.icon}
        />
      ))}
      
      {/* Hiệu ứng confetti rơi */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={`confetti-${i}`}
          className="absolute w-2 h-2 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            backgroundColor: ['#f472b6', '#fb7185', '#fbbf24', '#a78bfa'][Math.floor(Math.random() * 4)]
          }}
          initial={{ y: -50, opacity: 1 }}
          animate={{
            y: window.innerHeight + 50,
            x: Math.random() * 200 - 100,
            rotate: 360,
            opacity: [1, 1, 0]
          }}
          transition={{
            delay: Math.random() * 2,
            duration: 3,
            ease: "easeIn"
          }}
        />
      ))}
    </div>
  );
}
