import React, { useState, useEffect } from 'react';
import { borrowingService } from '../services/borrowingServices';
import BorrowingForm from '../components/expenses/dashboard/borrowings/BorrowingForm';
import { format } from 'date-fns';

const Borrowings = () => {
  const [borrowings, setBorrowings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editBorrowing, setEditBorrowing] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all'); // 'all', 'unpaid', 'repaid'

  // Fetch borrowings
  const fetchBorrowings = async () => {
    try {
      setLoading(true);
      let params = {};
      
      if (filterStatus === 'unpaid') {
        params.isRepaid = false;
      } else if (filterStatus === 'repaid') {
        params.isRepaid = true;
      }
      
      const data = await borrowingService.getBorrowings(params.isRepaid);
      setBorrowings(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBorrowings();
  }, [filterStatus]);

  const handleAddBorrowing = async (borrowingData) => {
    try {
      await borrowingService.createBorrowing(borrowingData);
      setShowAddForm(false);
      fetchBorrowings();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEditBorrowing = async (borrowingData) => {
    try {
      await borrowingService.updateBorrowing(editBorrowing._id, borrowingData);
      setEditBorrowing(null);
      fetchBorrowings();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleMarkAsRepaid = async (id) => {
    try {
      await borrowingService.markAsRepaid(id);
      fetchBorrowings();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteBorrowing = async (id) => {
    if (window.confirm('Are you sure you want to delete this borrowing record?')) {
      try {
        await borrowingService.deleteBorrowing(id);
        fetchBorrowings();
      } catch (err) {
        setError(err.message);
      }
    }
  };

  // Helper function to format date
  const formatDate = (dateString) => {
    return dateString ? format(new Date(dateString), 'MMM dd, yyyy') : '-';
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Borrowings</h1>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {showAddForm ? 'Cancel' : 'Add Borrowing'}
        </button>
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {/* Add/Edit Form */}
      {(showAddForm || editBorrowing) && (
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-semibold mb-4">
            {editBorrowing ? 'Edit Borrowing Record' : 'Add New Borrowing'}
          </h2>
          <BorrowingForm 
            onSubmit={editBorrowing ? handleEditBorrowing : handleAddBorrowing}
            initialData={editBorrowing || {}}
            isEditing={!!editBorrowing}
          />
        </div>
      )}
      
            {/* Filter Controls */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="flex flex-wrap gap-4">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-4 py-2 rounded ${
              filterStatus === 'all' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
          >
            All Borrowings
          </button>
          
          <button
            onClick={() => setFilterStatus('unpaid')}
            className={`px-4 py-2 rounded ${
              filterStatus === 'unpaid' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
          >
            Unpaid
          </button>
          
          <button
            onClick={() => setFilterStatus('repaid')}
            className={`px-4 py-2 rounded ${
              filterStatus === 'repaid' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
          >
            Repaid
          </button>
        </div>
      </div>
      
      {/* Borrowings List */}
      {loading ? (
        <div className="flex justify-center py-10">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : borrowings.length === 0 ? (
        <div className="bg-white p-6 rounded-lg shadow text-center">
          <p className="text-gray-500">No borrowings found.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  From
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date Borrowed
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Due Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {borrowings.map(borrowing => (
                <tr key={borrowing._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {borrowing.from}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {borrowing.description || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {formatDate(borrowing.date)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {formatDate(borrowing.dueDate) || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap font-medium">
                    ₹{borrowing.amount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {borrowing.isRepaid ? (
                      <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                        Repaid {borrowing.repaidDate ? `on ${formatDate(borrowing.repaidDate)}` : ''}
                      </span>
                    ) : (
                      <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">
                        Unpaid
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {!borrowing.isRepaid && (
                      <button
                        onClick={() => handleMarkAsRepaid(borrowing._id)}
                        className="text-green-600 hover:text-green-900 mr-2"
                      >
                        Mark as Repaid
                      </button>
                    )}
                    <button
                      onClick={() => setEditBorrowing(borrowing)}
                      className="text-blue-600 hover:text-blue-900 mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteBorrowing(borrowing._id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Borrowings;
