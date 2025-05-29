// src/components/TicketPool.jsx
import React from 'react';

const TicketPool = ({ availableTickets, totalTransactions, capacityUsage, maxCapacity }) => {
  return (
    <div className="bg-white rounded-lg p-6 shadow">
      <h2 className="text-lg font-semibold mb-6">Ticket Pool Status</h2>
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="text-sm font-medium text-blue-800 mb-2">Available Tickets</div>
          <div className="text-3xl font-bold text-blue-900">{availableTickets}</div>
          <div className="text-sm text-blue-600">of {maxCapacity} max</div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="text-sm font-medium text-green-800 mb-2">Customers Purchased</div>
          <div className="text-3xl font-bold text-green-900">{totalTransactions}</div>
          <div className="text-sm text-green-600">processed</div>
        </div>
      </div>
      <div>
        <div className="flex justify-between text-sm mb-2">
          <span>Capacity Usage</span>
          <span>{capacityUsage.toFixed(1)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-500" 
            style={{ width: `${Math.min(capacityUsage, 100)}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default TicketPool;