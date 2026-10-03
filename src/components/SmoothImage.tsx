import React, { useState, useEffect } from 'react';

interface SmoothImageProps {
  src?: string;
  className?: string;
  containerClassName?: string;
  onClick?: () => void;
  onDragStart?: (e: React.DragEvent) => void;
  referrerPolicy?: React.HTMLAttributeReferrerPolicy;
}

export default function SmoothImage({
  src,
  className = '',
  containerClassName = '',
  onClick,
  onDragStart,
  referrerPolicy = 'no-referrer',
}: SmoothImageProps) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(false);
  }, [src]);

  return (
    <div className={`relative overflow-hidden bg-transparent ${containerClassName}`}>
      {src && (
        <img
          src={src}
          onLoad={() => setLoaded(true)}
          className={`transition-opacity duration-700 ease-out ${loaded ? 'opacity-100' : 'opacity-0'} ${className}`}
          referrerPolicy={referrerPolicy}
          onClick={onClick}
          onDragStart={onDragStart}
        />
      )}
    </div>
  );
}
