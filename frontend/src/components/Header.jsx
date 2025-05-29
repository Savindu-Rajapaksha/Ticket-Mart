import React from 'react';

const Header = () => {
  return (
    <div className="bg-white rounded-lg border p-4 mb-6">
      <div className="flex items-center gap-2">
        <div className="text-blue-600 w-7 h-6">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path 
              d="M3 12h4l2-8 4 16 2-8h6" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <h1 className="text-xl">Ticket System</h1>
      </div>
    </div>
  );
};

export default Header;