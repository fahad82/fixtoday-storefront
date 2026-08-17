// src/components/common/Loader.tsx
"use client";

import React from 'react';
import { FaSpinner } from 'react-icons/fa';

interface LoaderProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
  fullScreen?: boolean;
  text?: string;
}

export const Loader: React.FC<LoaderProps> = ({
  size = 'medium',
  color = 'blue-600',
  fullScreen = false,
  text,
}) => {
  const sizeClasses = {
    small: 'w-6 h-6',
    medium: 'w-10 h-10',
    large: 'w-16 h-16',
  };

  const spinner = (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className={`relative ${sizeClasses[size]}`}>
        <div className={`absolute inset-0 border-4 border-${color}/20 rounded-full`}></div>
        <div className={`absolute inset-0 border-4 border-${color} rounded-full animate-spin border-t-transparent`}></div>
      </div>
      {text && <p className="text-gray-500 text-sm">{text}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
        {spinner}
      </div>
    );
  }

  return spinner;
};

export default Loader;