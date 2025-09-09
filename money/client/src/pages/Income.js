import React, { useState, useEffect } from 'react';
import { incomeService } from '../services/incomeService';
import IncomeForm from '../components/income/IncomeForm';
import { format } from 'date-fns';

const Income = () => {
  const [incomes, setIncomes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editIncome, setEditIncome] = useState(null);

  const fetchIncomes = async () => {
    try {
      setLoading(true);
      const data = await incomeService.getIncomes();
      setIncomes(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIncomes();
  }, []);

  const handleAddIncome = async (incomeData) => {
    try {
      await incomeService.createIncome(incomeData);
      setShowAddForm(false);
      setEditIncome(null);
      fetchIncomes();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEditIncome = async (incomeData) => {
    try {
      await incomeService.updateIncome(editIncome._id, incomeData);
      setEditIncome(null);
      setShowAddForm(false);
      fetchIncomes();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteIncome = async (id) => {
    if (window.confirm('Are you sure you want to delete this income record?')) {
      try {
        await incomeService.deleteIncome(id);
        fetchIncomes();
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const formatDate = (dateString) => {
    return format(new Date(dateString), 'MMM dd, yyyy');
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold">Income</h1>
        <button
          onClick={() => {
            setShowAddForm(!showAddForm);
            setEditIncome(null);
          }}
          className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          {showAddForm || editIncome ? 'Cancel' : 'Add New Income'}
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {(showAddForm || editIncome) && (
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-semibold mb-4">
            {editIncome ? 'Edit Income' : 'Add New Income'}
          </h2>
          <IncomeForm
            onSubmit={editIncome ? handleEditIncome : handleAddIncome}
            initialData={editIncome || {}}
            isEditing={!!editIncome}
          />
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-10">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : incomes.length === 0 ? (
        <div className="bg-white p-6 rounded-lg shadow text-center">
          <p className="text-gray-500">No income records found.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {/* Mobile View - Cards */}
          <div className="sm:hidden">
            {incomes.map(income => (
              <div key={income._id} className="px-4 py-4 border-b border-gray-200">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-gray-800">{income.source}</p>
                    <p className="text-sm text-gray-600">{income.description || '-'}</p>
                    <p className="text-xs text-gray-500 mt-1">{formatDate(income.date)}</p>
                  </div>
                  <p className="font-bold text-lg text-green-600">₹{income.amount.toFixed(2)}</p>
                </div>
                <div className="flex justify-end gap-4 mt-2">
                  <button
                    onClick={() => {
                      setEditIncome(income);
                      setShowAddForm(true);
                    }}
                    className="text-sm font-medium text-blue-600 hover:text-blue-800"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteIncome(income._id)}
                    className="text-sm font-medium text-red-600 hover:text-red-800"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop View - Table */}
          <div className="hidden sm:block">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Source
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {incomes.map(income => (
                  <tr key={income._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="text-sm text-gray-900">{income.source}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="text-sm text-gray-900">{income.description || '-'}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="text-sm text-gray-500">{formatDate(income.date)}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-green-600">
                      ₹{income.amount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => {
                          setEditIncome(income);
                          setShowAddForm(true);
                        }}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteIncome(income._id)}
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
  );
};

export default Income;
