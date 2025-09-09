import React, { useState, useEffect } from 'react';
import { borrowingService } from '../services/borrowingServices';
import BorrowingForm from '../components/expenses/dashboard/borrowings/BorrowingForm';
// import RepaymentForm from '../components/expenses/dashboard/borrowings/RepaymentForm';
import { format } from 'date-fns';

const Borrowings = () => {
  const [borrowings, setBorrowings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editBorrowing, setEditBorrowing] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all'); // 'all', 'unpaid', 'repaid'

  useEffect(() => {
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

    fetchBorrowings();
  }, [filterStatus]);

  const handleAddBorrowing = async (borrowingData) => {
    try {
      await borrowingService.createBorrowing(borrowingData);
      setShowAddForm(false);
      setEditBorrowing(null);
      fetchBorrowings();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEditBorrowing = async (borrowingData) => {
    try {
      await borrowingService.updateBorrowing(editBorrowing._id, borrowingData);
      setEditBorrowing(null);
      setShowAddForm(false);
      fetchBorrowings();
    } catch (err) {
      setError(err.message);
    }
  };

  // const handleRepaymentSubmit = async (repaymentData) => {
  //   if (!repayingBorrowing) return;
  //   try {
  //     await borrowingService.markAsRepaid(repayingBorrowing._id, repaymentData);
  //     setRepayingBorrowing(null);
  //     fetchBorrowings();
  //   } catch (err) {
  //     setError(err.message);
  //   }
  // };

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
    <>
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <h1 className="text-2xl font-bold">Borrowings</h1>
          <button
            onClick={() => {
              setShowAddForm(!showAddForm);
              setEditBorrowing(null);
            }}
            className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            {showAddForm || editBorrowing ? 'Cancel' : 'Add Borrowing'}
          </button>
        </div>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
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
        
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <div className="flex flex-wrap items-center gap-4">
            <p className="text-sm font-medium text-gray-600">Filter by:</p>
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-4 py-2 text-sm rounded-md ${
                filterStatus === 'all' 
                  ? 'bg-blue-600 text-white shadow' 
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilterStatus('unpaid')}
              className={`px-4 py-2 text-sm rounded-md ${
                filterStatus === 'unpaid' 
                  ? 'bg-blue-600 text-white shadow' 
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
            >
              Unpaid
            </button>
            <button
              onClick={() => setFilterStatus('repaid')}
              className={`px-4 py-2 text-sm rounded-md ${
                filterStatus === 'repaid' 
                  ? 'bg-blue-600 text-white shadow' 
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
            >
              Repaid
            </button>
          </div>
        </div>
        
        {loading ? (
          <div className="flex justify-center py-10">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : borrowings.length === 0 ? (
          <div className="bg-white p-6 rounded-lg shadow text-center">
            <p className="text-gray-500">No borrowings found for this filter.</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            {/* Mobile View */}
            <div className="sm:hidden">
              {borrowings.map(borrowing => (
                <div key={borrowing._id} className="px-4 py-4 border-b border-gray-200">
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <p className="font-semibold text-gray-800">From: {borrowing.from}</p>
                      <p className="text-sm text-gray-600">{borrowing.description || 'No description'}</p>
                    </div>
                    <p className="font-bold text-lg text-blue-600">₹{borrowing.amount.toFixed(2)}</p>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                      <div>
                          <p className="text-xs text-gray-500">Borrowed: {formatDate(borrowing.date)}</p>
                          <p className="text-xs text-gray-500">Due: {formatDate(borrowing.dueDate)}</p>
                      </div>
                      {borrowing.isRepaid ? (
                        <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                          Repaid
                        </span>
                      ) : (
                        <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">
                          Unpaid
                        </span>
                      )}
                  </div>
                  <div className="flex justify-end items-center gap-2 mt-3 border-t border-gray-100 pt-2">
                    
                    
                      <button
                        onClick={() => {
                          setEditBorrowing(borrowing);
                          setShowAddForm(true);
                        }}
                        className="text-sm font-medium text-blue-600 hover:text-blue-800"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteBorrowing(borrowing._id)}
                        className="text-sm font-medium text-red-600 hover:text-red-800"
                      >
                        Delete
                      </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop View */}
            <div className="hidden sm:block">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">From</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Borrowed</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {borrowings.map(borrowing => (
                    <tr key={borrowing._id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{borrowing.from}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{borrowing.description || '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(borrowing.date)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(borrowing.dueDate)}</td>
                      <td className="px-6 py-4 whitespace-nowrap font-medium text-blue-600">₹{borrowing.amount.toFixed(2)}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {borrowing.isRepaid ? (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            Repaid {borrowing.repaidDate ? `on ${formatDate(borrowing.repaidDate)}` : ''}
                          </span>
                        ) : (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                            Unpaid
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        
                        
                        <button
                          onClick={() => {
                            setEditBorrowing(borrowing);
                            setShowAddForm(true);
                          }}
                          className="text-blue-600 hover:text-blue-900 mr-4"
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
          </div>
        )}
      </div>

      {/* Repayment Modal */}
      {/* {repayingBorrowing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Repay Borrowing</h2>
            <p className="mb-4 text-sm text-gray-600">You are repaying <strong>₹{repayingBorrowing.amount.toFixed(2)}</strong> to <strong>{repayingBorrowing.from}</strong>.</p>
            <RepaymentForm 
              onSubmit={handleRepaymentSubmit}
              onCancel={() => setRepayingBorrowing(null)}
            />
          </div>
        </div>
      )} */}

    
    </>
  );
};

export default Borrowings;
