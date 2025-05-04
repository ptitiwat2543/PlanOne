import React, { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { Button, ButtonProps } from '@/components/ui/button';

// Animation variants for button
const buttonVariants = {
  hidden: {
    opacity: 0,
    y: 20,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring',
      damping: 12,
      stiffness: 200,
      duration: 0.5,
    },
  },
  hover: {
    scale: 1.04,
    boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)',
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 10,
    },
  },
  tap: {
    scale: 0.98,
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
    transition: {
      type: 'spring',
      stiffness: 500,
      damping: 15,
    },
  },
};

// สร้าง AnimatedButton component ที่รองรับ props ทั้งหมดของ Button
export const AnimatedButton = forwardRef<HTMLButtonElement, ButtonProps & { delay?: number }>(
  ({ className, delay = 0, ...props }, ref) => {
    return (
      <motion.div
        initial="hidden"
        animate="visible"
        whileHover="hover"
        whileTap="tap"
        variants={buttonVariants}
        transition={{ delay }}
        className="mt-8 mb-4" // เพิ่มระยะห่างด้านบนและล่างของปุ่ม
      >
        <Button ref={ref} className={className} {...props} />
      </motion.div>
    );
  }
);

AnimatedButton.displayName = 'AnimatedButton';
