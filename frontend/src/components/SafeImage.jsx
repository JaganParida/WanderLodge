import React, { useState } from 'react';
import { Image as ImageIcon } from 'lucide-react';

const SafeImage = ({ src, alt, className, fallbackIconSize = 24 }) => {
  const [hasError, setHasError] = useState(false);

  if (hasError || !src) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 text-gray-400 ${className || ''}`}>
        <ImageIcon size={fallbackIconSize} />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt || "Image"}
      className={className}
      onError={() => setHasError(true)}
    />
  );
};

export default SafeImage;
