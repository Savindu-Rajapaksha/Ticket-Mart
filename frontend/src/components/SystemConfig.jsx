import React from 'react';

const SystemConfig = ({ config, onConfigChange, disabled }) => {
  return (
    <div className="bg-white rounded-lg p-6 shadow">
      <h2 className="text-lg font-semibold mb-6">System Configuration</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">


        <div>
          <label className="block text-sm text-gray-700 mb-1">
            Total Tickets
          </label>
          <input
            type="number"
            value={config.totalTickets}
            onChange={(e) => onConfigChange('totalTickets', e.target.value)}
            disabled={disabled}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
          />
        </div>
        
        <div>
          <label className="block text-sm text-gray-700 mb-1">
            Ticket Release Rate (milliseconds)
          </label>
          <input
            type="number"
            value={config.ticketReleaseRate}
            onChange={(e) => onConfigChange('ticketReleaseRate', e.target.value)}
            disabled={disabled}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
          />
        </div>
        
        <div>
          <label className="block text-sm text-gray-700 mb-1">
            Customer Retrieval Rate (milliseconds)
          </label>
          <input
            type="number"
            value={config.customerRetrievalRate}
            onChange={(e) => onConfigChange('customerRetrievalRate', e.target.value)}
            disabled={disabled}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
          />
        </div>
        
        <div>
          <label className="block text-sm text-gray-700 mb-1">
            Max Ticket Capacity
          </label>
          <input
            type="number"
            value={config.maxTicketCapacity}
            onChange={(e) => onConfigChange('maxTicketCapacity', e.target.value)}
            disabled={disabled}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
          />
        </div>
      </div>
      
      {disabled && (
        <div className="mt-4 text-sm text-gray-500">
          Configuration cannot be changed while event is running
        </div>
      )}
    </div>
  );
};

export default SystemConfig;