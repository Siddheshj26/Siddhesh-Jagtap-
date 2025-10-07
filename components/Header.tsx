
import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="bg-gray-800/50 backdrop-blur-sm shadow-lg p-4 sticky top-0 z-10">
      <div className="container mx-auto flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-400 mr-3" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12.89,3L14.85,6.4L11.4,4.42L12.89,3M19.5,7.5L17.5,4L19.16,6.84L19.5,7.5M12,9.18L14.07,13.13L16.13,9.18L12,2L7.87,9.18L9.93,13.13L12,9.18M21.5,9.5L19.84,6.84L18.5,9L19.5,7.5L16.13,9.18L18.5,13.5L21.9,11.5L21.5,9.5M4.5,7.5L6.5,4L4.84,6.84L4.5,7.5M11.4,4.42L9.15,3L11.11,6.4L11.4,4.42M12,22L7.87,14.82L9.93,10.87L12,14.82L14.07,10.87L16.13,14.82L12,22M4.09,11.5L7.5,13.5L5.5,9.18L2.5,9.5L2.1,11.5L4.09,11.5Z" />
        </svg>
        <h1 className="text-2xl font-bold text-white">AI 3D Video Animator</h1>
      </div>
    </header>
  );
};
