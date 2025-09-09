import React from 'react';

const DashboardSummary = ({ totalSpent, totalBorrowed, totalIncome }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-sm font-medium text-gray-500 mb-2">Total Spent This Week</h2>
        <div className="flex items-end space-x-2">
          <span className="text-3xl font-bold text-gray-900">₹{totalSpent.toFixed(2)}</span>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-sm font-medium text-gray-500 mb-2">Total Borrowed</h2>
        <div className="flex items-end space-x-2">
          <span className="text-3xl font-bold text-gray-900">₹{totalBorrowed.toFixed(2)}</span>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-sm font-medium text-gray-500 mb-2">Total Income</h2>
        <div className="flex items-end space-x-2">
          <span className="text-3xl font-bold text-gray-900">₹{(totalIncome || 0).toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

export default DashboardSummary;
