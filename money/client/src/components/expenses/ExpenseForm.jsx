import React, { useState } from 'react';

const ExpenseForm = ({ onSubmit, initialData = {}, isEditing = false }) => {
  const [formData, setFormData] = useState({
    amount: initialData.amount || '',
    category: initialData.category || 'Food',
    description: initialData.description || '',
    date: initialData.date ? new Date(initialData.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    isRegular: initialData.isRegular || false
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const categories = [
    'Food', 
    'Transport', 
    'Housing', 
    'Entertainment', 
    'Utilities', 
    'Healthcare', 
    'Other'
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.amount || formData.amount <= 0) {
      newErrors.amount = 'Please enter a valid amount';
    }
    
    if (!formData.category) {
      newErrors.category = 'Please select a category';
    }
    
    if (!formData.date) {
      newErrors.date = 'Please select a date';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validate()) {
      try {
        setLoading(true);
        // Convert amount to number
        const submissionData = {
          ...formData,
          amount: parseFloat(formData.amount)
        };
        
        await onSubmit(submissionData);
      } catch (error) {
        console.error('Error submitting form:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="amount">
          Amount
        </label>
        <input
          className={`shadow appearance-none border ${errors.amount ? 'border-red-500' : 'border-gray-300'} rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
          id="amount"
          name="amount"
          type="number"
          step="0.01"
          placeholder="0.00"
          value={formData.amount}
          onChange={handleChange}
        />
        {errors.amount && <p className="text-red-500 text-xs italic mt-1">{errors.amount}</p>}
      </div>
      
      <div>
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="category">
          Category
        </label>
        <select
          className={`shadow appearance-none border ${errors.category ? 'border-red-500' : 'border-gray-300'} rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
          id="category"
          name="category"
          value={formData.category}
          onChange={handleChange}
        >
          {categories.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
        {errors.category && <p className="text-red-500 text-xs italic mt-1">{errors.category}</p>}
      </div>
      
      <div>
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
          Description
        </label>
        <input
          className="shadow appearance-none border border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="description"
          name="description"
          type="text"
          placeholder="Describe your expense"
          value={formData.description}
          onChange={handleChange}
        />
      </div>
      
      <div>
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="date">
          Date
        </label>
        <input
          className={`shadow appearance-none border ${errors.date ? 'border-red-500' : 'border-gray-300'} rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
          id="date"
          name="date"
          type="date"
          value={formData.date}
          onChange={handleChange}
        />
        {errors.date && <p className="text-red-500 text-xs italic mt-1">{errors.date}</p>}
      </div>
      
      <div className="flex items-center">
        <input
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mr-2"
          id="isRegular"
          name="isRegular"
          type="checkbox"
          checked={formData.isRegular}
          onChange={handleChange}
        />
        <label className="text-gray-700" htmlFor="isRegular">
          This is a regular expense
        </label>
      </div>
      
      <div className="flex items-center justify-end">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
          type="submit"
          disabled={loading}
        >
          {loading ? (isEditing ? 'Updating...' : 'Adding...') : (isEditing ? 'Update Expense' : 'Add Expense')}
        </button>
      </div>
    </form>
  );
};

export default ExpenseForm;
