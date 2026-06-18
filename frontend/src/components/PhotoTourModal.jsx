import { useState } from 'react';
import { X, ChevronLeft } from 'lucide-react';

const PhotoTourModal = ({ isOpen, onClose, images, title }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] bg-white flex flex-col animate-in fade-in duration-300">
      {/* Top Navbar */}
      <div className="flex items-center justify-between p-4 sm:p-6 bg-white sticky top-0 z-10 border-b border-gray-100">
        <button 
          onClick={onClose} 
          className="flex items-center justify-center p-2 rounded-full hover:bg-gray-100 transition"
        >
          <ChevronLeft size={24} />
        </button>
        <div className="flex gap-4">
           {/* Can add share/save buttons here in the future if needed */}
        </div>
      </div>

      {/* Photo Content */}
      <div className="flex-1 overflow-y-auto px-4 py-8">
        <div className="max-w-3xl mx-auto flex flex-col gap-4">
          {images && images.length > 0 ? (
            images.map((img, index) => (
              <div key={index} className="w-full">
                <img 
                  src={img.url || img} 
                  alt={`${title || 'Listing'} - Photo ${index + 1}`} 
                  className="w-full h-auto object-cover rounded-xl"
                  loading="lazy"
                />
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500 py-20">No photos available.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PhotoTourModal;
