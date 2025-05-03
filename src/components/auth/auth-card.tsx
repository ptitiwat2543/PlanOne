'use client';

import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

interface AuthCardProps {
  title: string;
  children: ReactNode;
  footer?: ReactNode;
  delay?: number;
}

export function AuthCard({ title, children, footer, delay = 0.3 }: AuthCardProps) {
  return (
    <Card 
      animate={true} 
      className="w-full max-w-md mx-auto"
      as={motion.div}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay, duration: 0.5 }}
    >
      <CardHeader className="pb-2">
        <CardTitle className="text-center text-2xl font-bold">{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-8 pt-4">
        {children}
      </CardContent>
      {footer && (
        <CardFooter className="flex justify-center py-4 border-t">
          {footer}
        </CardFooter>
      )}
    </Card>
  );
}
