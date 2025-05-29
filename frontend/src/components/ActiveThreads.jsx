import React from 'react';

const ActiveThreads = ({ vendorThreads = 0, customerThreads = 0 }) => {
  return (
    <div className="bg-white rounded-lg p-6 shadow">
      <h2 className="text-lg font-semibold mb-6">Active Threads</h2>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <span className="w-3 h-3 bg-purple-500 rounded-full mr-2"></span>
            <span className="text-gray-700">Vendor Threads</span>
          </div>
          <span className="bg-purple-100 text-purple-600 px-3 py-1 rounded-full">
            {vendorThreads}
          </span>
        </div>
        
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <span className="w-3 h-3 bg-green-500 rounded-full mr-2 mb-10"></span>
            <span className="text-gray-700 text mb-10">Customer Threads</span>
            <br/><br/><br/><br/>
          </div>
          <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full">
            {customerThreads}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ActiveThreads;