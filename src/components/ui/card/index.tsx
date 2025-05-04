import React from 'react';
import { cn } from '@/lib/utils';
import { motion, HTMLMotionProps } from 'framer-motion';

interface CardProps extends Omit<HTMLMotionProps<'div'>, 'animate'> {
  children: React.ReactNode;
  animate?: boolean;
}

// Animation variants
const cardVariants = {
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
      duration: 0.5,
      type: 'spring',
      stiffness: 100,
      damping: 15,
    },
  },
};

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, children, animate = true, ...props }, ref) => {
    if (animate) {
      return (
        <motion.div
          ref={ref}
          className={cn(
            'bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg shadow-md overflow-hidden',
            className
          )}
          initial="hidden"
          animate="visible"
          variants={cardVariants}
          {...props}
        >
          {children}
        </motion.div>
      );
    } else {
      // When not using animation, filter out props to use only those compatible with regular HTML div
      const safeProps: React.HTMLAttributes<HTMLDivElement> = {
        className: className,
      };

      // Add other props compatible with standard HTML div (e.g., id, style, etc.)
      // but exclude framer-motion specific props
      const {
        // Exclude framer-motion specific props with rename pattern for unused variables
        onDrag: _onDrag,
        onDragStart: _onDragStart,
        onDragEnd: _onDragEnd,
        whileHover: _whileHover,
        whileTap: _whileTap,
        initial: _initial,
        variants: _variants,
        transition: _transition,
        custom: _custom,
        ...restProps
      } = props;

      // Add remaining props to safeProps
      Object.keys(restProps).forEach((key) => {
        // Add only native HTML attributes
        if (
          typeof restProps[key as keyof typeof restProps] !== 'function' ||
          key.startsWith('on')
        ) {
          // Include event handlers
          (safeProps as Record<string, unknown>)[key] = restProps[key as keyof typeof restProps];
        }
      });

      return (
        <div
          ref={ref}
          className={cn(
            'bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg shadow-md overflow-hidden',
            className
          )}
          {...safeProps}
        >
          {children}
        </div>
      );
    }
  }
);
Card.displayName = 'Card';

interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('px-6 py-5 border-b border-neutral-200 dark:border-neutral-800', className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);
CardHeader.displayName = 'CardHeader';

interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode;
}

export const CardTitle = React.forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <h3 ref={ref} className={cn('text-xl font-semibold', className)} {...props}>
        {children}
      </h3>
    );
  }
);
CardTitle.displayName = 'CardTitle';

interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn('px-6 py-5', className)} {...props}>
        {children}
      </div>
    );
  }
);
CardContent.displayName = 'CardContent';

interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('px-6 py-5 border-t border-neutral-200 dark:border-neutral-800', className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);
CardFooter.displayName = 'CardFooter';
