import React from 'react';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';

const BorrowingsOverview = ({ borrowings }) => {
  // Filter to get only unpaid borrowings
  const unpaidBorrowings = borrowings.filter(b => !b.isRepaid);

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-lg font-medium text-gray-900">Borrowings Overview</h2>
        <Link to="/borrowings" className="text-sm text-blue-600 hover:text-blue-500">
          View all
        </Link>
      </div>
      
      {unpaidBorrowings.length === 0 ? (
        <div className="p-6 text-center text-gray-500">
          No unpaid borrowings found.
        </div>
      ) : (
        <ul className="divide-y divide-gray-200">
          {unpaidBorrowings.slice(0, 5).map(borrowing => (
            <li key={borrowing._id} className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">From: {borrowing.from}</p>
                  <p className="text-xs text-gray-500">{borrowing.description}</p>
                  <p className="text-xs text-gray-500">
                    Borrowed on: {format(new Date(borrowing.date), 'MMM dd, yyyy')}
                  </p>
                  {borrowing.dueDate && (
                    <p className="text-xs text-red-500">
                      Due: {format(new Date(borrowing.dueDate), 'MMM dd, yyyy')}
                    </p>
                  )}
                </div>
                <div className="text-sm font-medium text-gray-900">₹{borrowing.amount.toFixed(2)}</div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default BorrowingsOverview;
