import React, { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { Input, InputProps } from '@/components/ui/input';

// Animation variants for input
const inputVariants = {
  hidden: {
    opacity: 0,
    y: 15,
    scale: 0.98,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring',
      damping: 15,
      stiffness: 300,
      duration: 0.4,
    },
  },
};

// สร้าง AnimatedInput component ที่รองรับ props ทั้งหมดของ Input
export const AnimatedInput = forwardRef<HTMLInputElement, InputProps & { delay?: number }>(
  ({ delay = 0, ...props }, ref) => {
    return (
      <motion.div
        initial="hidden"
        animate="visible"
        variants={inputVariants}
        transition={{ delay }}
        className="mb-6" // เพิ่มระยะห่างระหว่าง input
      >
        <Input ref={ref} {...props} />
      </motion.div>
    );
  }
);

AnimatedInput.displayName = 'AnimatedInput';
