import React, { ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface FadeInProps {
  children: ReactNode;
  duration?: number;
  delay?: number;
  className?: string;
}

export const FadeIn: React.FC<FadeInProps> = ({
  children,
  duration = 0.5,
  delay = 0,
  className = '',
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ 
        duration, 
        delay,
        ease: "easeOut" 
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

interface SlideInProps {
  children: ReactNode;
  direction?: 'left' | 'right' | 'up' | 'down';
  duration?: number;
  delay?: number;
  className?: string;
}

export const SlideIn: React.FC<SlideInProps> = ({
  children,
  direction = 'up',
  duration = 0.5,
  delay = 0,
  className = '',
}) => {
  const getDirectionValues = () => {
    switch (direction) {
      case 'left':
        return { initial: { x: -60 }, animate: { x: 0 } };
      case 'right':
        return { initial: { x: 60 }, animate: { x: 0 } };
      case 'up':
        return { initial: { y: 60 }, animate: { y: 0 } };
      case 'down':
        return { initial: { y: -60 }, animate: { y: 0 } };
      default:
        return { initial: { y: 60 }, animate: { y: 0 } };
    }
  };

  const { initial, animate } = getDirectionValues();

  return (
    <motion.div
      initial={{ ...initial, opacity: 0 }}
      animate={{ ...animate, opacity: 1 }}
      exit={{ ...initial, opacity: 0 }}
      transition={{ 
        duration, 
        delay,
        type: "spring",
        damping: 20,
        stiffness: 100
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

interface StaggerChildrenProps {
  children: ReactNode[];
  staggerDelay?: number;
  duration?: number;
  initialDelay?: number;
  className?: string;
  distance?: number;
}

export const StaggerChildren: React.FC<StaggerChildrenProps> = ({
  children,
  staggerDelay = 0.1,
  duration = 0.5,
  initialDelay = 0,
  className = '',
  distance = 30
}) => {
  return (
    <div className={className}>
      <AnimatePresence>
        {React.Children.map(children, (child, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: distance }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: distance }}
            transition={{
              duration,
              delay: initialDelay + i * staggerDelay,
              type: "spring",
              damping: 15,
              stiffness: 200
            }}
            className="mb-6" // เพิ่มระยะห่างระหว่างแต่ละ child component
          >
            {child}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

interface ScaleInProps {
  children: ReactNode;
  duration?: number;
  delay?: number;
  className?: string;
}

export const ScaleIn: React.FC<ScaleInProps> = ({
  children,
  duration = 0.5,
  delay = 0,
  className = '',
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ 
        duration, 
        delay,
        type: "spring",
        damping: 15,
        stiffness: 200
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

interface BounceInProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

export const BounceIn: React.FC<BounceInProps> = ({
  children,
  delay = 0,
  className = '',
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.3, y: 50 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.3, y: 50 }}
      transition={{ 
        type: "spring",
        stiffness: 220,
        damping: 12,
        delay,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

interface FlipInProps {
  children: ReactNode;
  direction?: 'x' | 'y';
  delay?: number;
  className?: string;
}

export const FlipIn: React.FC<FlipInProps> = ({
  children,
  direction = 'y',
  delay = 0,
  className = '',
}) => {
  const rotate = direction === 'x' ? { rotateX: [90, 0] } : { rotateY: [90, 0] };
  
  return (
    <motion.div
      initial={{ opacity: 0, ...rotate, perspective: 1000 }}
      animate={{ opacity: 1, [direction === 'x' ? 'rotateX' : 'rotateY']: 0 }}
      exit={{ opacity: 0, [direction === 'x' ? 'rotateX' : 'rotateY']: 90 }}
      transition={{ 
        type: "spring",
        stiffness: 100,
        damping: 15,
        delay,
      }}
      className={className}
      style={{ transformStyle: "preserve-3d" }}
    >
      {children}
    </motion.div>
  );
};
