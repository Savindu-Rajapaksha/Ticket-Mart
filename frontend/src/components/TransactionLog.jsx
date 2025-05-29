import React, { useEffect, useRef } from 'react';

const TransactionLog = ({ transactions = [] }) => {
    const logContainerRef = useRef(null);

    // Auto-scroll to bottom when new transactions arrive
    useEffect(() => {
        if (logContainerRef.current) {
            logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
        }
    }, [transactions]);

    // Function to determine message type and color
    const getMessageStyle = (message) => {
        if (message.includes('Vendor')) {
            return 'bg-purple-50 text-purple-700';
        }
        if (message.includes('Customer')) {
            return 'bg-green-50 text-green-700';
        }
        if (message.includes('Error') || message.includes('failed')) {
            return 'bg-red-50 text-red-700';
        }
        if (message.includes('started')) {
            return 'bg-blue-50 text-blue-700';
        }
        if (message.includes('stopped')) {
            return 'bg-orange-50 text-orange-700';
        }
        return 'bg-gray-50 text-gray-700';
    };

    return (
        <div className="bg-white rounded-lg p-6 shadow">
            <h2 className="text-lg font-semibold mb-4">Transaction Log</h2>
            
            <div 
                ref={logContainerRef}
                className="space-y-2 max-h-[400px] overflow-y-auto pr-2"
            >
                {transactions.length === 0 ? (
                    <div className="text-gray-500 text-center py-4">
                        No transactions recorded
                    </div>
                ) : (
                    transactions.map((transaction) => (
                        <div 
                            key={transaction.id}
                            className={`p-3 rounded-lg transition-all duration-200 ${getMessageStyle(transaction.message)}`}
                        >
                            <div className="flex justify-between items-start">
                                <span className="text-sm font-medium">
                                    {transaction.message}
                                </span>
                                <span className="text-xs text-gray-500 ml-2 whitespace-nowrap">
                                    {transaction.timestamp}
                                </span>
                            </div>
                        </div>
                    ))
                )}
            </div>
            
            {transactions.length > 0 && (
                <div className="mt-4 pt-4 border-t text-sm text-gray-500 flex justify-between items-center">
                    <span>Total transactions: {transactions.length}</span>
                </div>
            )}
        </div>
    );
};

export default TransactionLog;