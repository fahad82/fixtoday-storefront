// components/CustomImage.tsx
'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { FaImage } from 'react-icons/fa';

interface CustomImageProps {
  src: string | null;
  alt: string;
  fill?: boolean;
  className?: string;
  sizes?: string;
  width?: number;
  height?: number;
}

const CustomImage: React.FC<CustomImageProps> = ({ 
  src, 
  alt, 
  fill = false, 
  className = '',
  sizes,
  width,
  height 
}) => {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  // Validate image URL
  const isValidUrl = (url: string | null): boolean => {
    if (!url) return false;
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  if (!src || !isValidUrl(src) || error) {
    return (
      <div className={`flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 ${className}`}>
        <div className="text-center">
          <FaImage className="w-8 h-8 mx-auto text-gray-400" />
          <span className="text-xs text-gray-500 mt-1 block">No Image</span>
        </div>
      </div>
    );
  }

  if (fill) {
    return (
      <div className="relative w-full h-full">
        <Image
          src={src}
          alt={alt}
          fill
          className={`object-cover transition-opacity duration-300 ${loading ? 'opacity-0' : 'opacity-100'} ${className}`}
          sizes={sizes}
          onLoadingComplete={() => setLoading(false)}
          onError={() => setError(true)}
          unoptimized={process.env.NODE_ENV === 'development'}
        />
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative" style={{ width, height }}>
      <Image
        src={src}
        alt={alt}
        width={width || 100}
        height={height || 100}
        className={`object-cover transition-opacity duration-300 ${loading ? 'opacity-0' : 'opacity-100'} ${className}`}
        onLoadingComplete={() => setLoading(false)}
        onError={() => setError(true)}
        unoptimized={process.env.NODE_ENV === 'development'}
      />
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
};

export default CustomImage;