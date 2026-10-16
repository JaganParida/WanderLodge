import React, { useState } from 'react';
import { Image as ImageIcon } from 'lucide-react';

const isSafeImageUrl = (url) => {
  if (!url || typeof url !== 'string') return false;
  const trimmed = url.trim();
  // Allow safe protocols only: https, http, relative paths, or base64 image data
  return /^(https?:\/\/|\/|data:image\/(png|jpe?g|webp|gif|svg\+xml);base64,)/i.test(trimmed);
};

const SafeImage = ({ src, alt, className, fallbackIconSize = 24, ...props }) => {
  const [hasError, setHasError] = useState(false);

  const isSafe = isSafeImageUrl(src);

  if (hasError || !src || !isSafe) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 text-gray-400 ${className || ''}`} {...props}>
        <ImageIcon size={fallbackIconSize} />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt || "Property Image"}
      className={className}
      onError={() => setHasError(true)}
      loading="lazy"
      {...props}
    />
  );
};

export default SafeImage;
