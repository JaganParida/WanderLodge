import React from 'react';
import { User } from 'lucide-react';

const Avatar = ({ user, className = "w-10 h-10 text-lg", showIconFallback = false }) => {
  if (user?.avatar) {
    return (
      <div className={`rounded-full overflow-hidden flex-shrink-0 bg-gray-200 ${className}`}>
        <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
      </div>
    );
  }

  if (user?.username && !showIconFallback) {
    const initials = user.username.substring(0, 2).toUpperCase();
    return (
      <div className={`rounded-full overflow-hidden flex-shrink-0 bg-airbnb text-white flex items-center justify-center font-bold tracking-wider ${className}`}>
        {initials}
      </div>
    );
  }

  return (
    <div className={`rounded-full overflow-hidden flex-shrink-0 bg-gray-500 text-white flex items-center justify-center ${className}`}>
      <User size={className.includes('w-10') ? 20 : 16} />
    </div>
  );
};

export default Avatar;
