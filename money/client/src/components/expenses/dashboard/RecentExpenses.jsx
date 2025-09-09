import React from 'react';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';

const RecentExpenses = ({ expenses }) => {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-lg font-medium text-gray-900">Recent Expenses</h2>
        <Link to="/expenses" className="text-sm text-blue-600 hover:text-blue-500">
          View all
        </Link>
      </div>
      
      {expenses.length === 0 ? (
        <div className="p-6 text-center text-gray-500">
          No recent expenses found. Start by adding a new expense.
        </div>
      ) : (
        <ul className="divide-y divide-gray-200">
          {expenses.map(expense => (
            <li key={expense._id} className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`p-2 rounded-full mr-4 ${getCategoryColor(expense.category)}`}>
                    {getCategoryIcon(expense.category)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{expense.description || expense.category}</p>
                    <p className="text-xs text-gray-500">{format(new Date(expense.date), 'MMM dd, yyyy')}</p>
                  </div>
                </div>
                <div className="text-sm font-medium text-gray-900">₹{expense.amount.toFixed(2)}</div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

// Helper functions for category styling
const getCategoryColor = (category) => {
  const colors = {
    Food: 'bg-green-100 text-green-600',
    Transport: 'bg-blue-100 text-blue-600',
    Housing: 'bg-purple-100 text-purple-600',
    Entertainment: 'bg-yellow-100 text-yellow-600',
    Utilities: 'bg-red-100 text-red-600',
    Healthcare: 'bg-indigo-100 text-indigo-600',
    Other: 'bg-gray-100 text-gray-600'
  };
  
  return colors[category] || colors.Other;
};

const getCategoryIcon = (category) => {
  const icons = {
    Food: '🍔',
    Transport: '🚗',
    Housing: '🏠',
    Entertainment: '🎬',
    Utilities: '💡',
    Healthcare: '🏥',
    Other: '📦'
  };
  
  return icons[category] || icons.Other;
};

export default RecentExpenses;
