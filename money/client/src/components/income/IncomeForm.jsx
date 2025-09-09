import React, { useState } from 'react';

const IncomeForm = ({ onSubmit, initialData = {}, isEditing = false }) => {
  const [formData, setFormData] = useState({
    amount: initialData.amount || '',
    source: initialData.source || '',
    description: initialData.description || '',
    date: initialData.date ? new Date(initialData.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.amount || formData.amount <= 0) {
      newErrors.amount = 'Please enter a valid amount';
    }

    if (!formData.source) {
      newErrors.source = 'Please enter a source';
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
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="source">
          Source
        </label>
        <input
          className={`shadow appearance-none border ${errors.source ? 'border-red-500' : 'border-gray-300'} rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
          id="source"
          name="source"
          type="text"
          placeholder="e.g. Salary, Freelance"
          value={formData.source}
          onChange={handleChange}
        />
        {errors.source && <p className="text-red-500 text-xs italic mt-1">{errors.source}</p>}
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
          placeholder="Describe the income"
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
      
      <div className="flex items-center justify-end">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
          type="submit"
          disabled={loading}
        >
          {loading ? (isEditing ? 'Updating...' : 'Adding...') : (isEditing ? 'Update Income' : 'Add Income')}
        </button>
      </div>
    </form>
  );
};

export default IncomeForm;