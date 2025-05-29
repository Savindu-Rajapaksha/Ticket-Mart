import React from 'react';

const ControlPanel = ({ onStart, onStop, onRestart, status }) => {
  return (
    <div className="bg-white rounded-lg p-6 shadow">
      <h2 className="text-lg font-semibold mb-6">Control Panel</h2>
      <div className="flex gap-4">
        <button
          onClick={onStart}
          disabled={status === 'running'}
          className={`flex items-center gap-2 px-5 py-2 text-white rounded ${
            status === 'running' 
              ? 'bg-green-400 cursor-not-allowed' 
              : 'bg-green-400 hover:bg-green-500'
          }`}
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 5v14l11-7z"/>
          </svg>
          Start
        </button>

        <button
          onClick={onStop}
          disabled={status !== 'running'}
          className={`flex items-center gap-2 px-5 py-2 text-white rounded ${
            status !== 'running'
              ? 'bg-red-400 cursor-not-allowed'
              : 'bg-red-500 hover:bg-red-600'
          }`}
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <rect x="6" y="6" width="12" height="12"/>
          </svg>
          Stop
        </button>

        <button
          onClick={onRestart}
          disabled={status === 'running'}
          className={`flex items-center gap-2 px-4 py-2 text-white rounded ${
            status === 'running'
              ? 'bg-blue-400 cursor-not-allowed'
              : 'bg-blue-500 hover:bg-blue-600'
          }`}
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" 
            />
          </svg>
          Restart
        </button>
      </div>
    </div>
  );
};

export default ControlPanel;