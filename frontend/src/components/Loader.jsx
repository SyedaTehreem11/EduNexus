import React from 'react';

const Loader = ({ message = 'Loading EduNexus data...', size = 'default' }) => {
  const sizeClasses = {
    small: 'w-5 h-5 border-2',
    default: 'w-10 h-10 border-3',
    large: 'w-14 h-14 border-4',
  }[size] || 'w-10 h-10 border-3';

  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-3">
      <div
        className={`${sizeClasses} border-[#73766A]/30 border-t-[#2D4354] dark:border-t-[#FED7A5] rounded-full animate-spin`}
        role="status"
        aria-label="loading"
      />
      {message && (
        <p className="text-sm font-medium text-[#534145] dark:text-[#FED7A5]/70 animate-pulse">
          {message}
        </p>
      )}
    </div>
  );
};

export default Loader;
