import React, { useState } from 'react';

const BorrowingForm = ({ onSubmit, initialData = {}, isEditing = false }) => {
  const [formData, setFormData] = useState({
    amount: initialData.amount || '',
    from: initialData.from || '',
    description: initialData.description || '',
    date: initialData.date ? new Date(initialData.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    dueDate: initialData.dueDate ? new Date(initialData.dueDate).toISOString().split('T')[0] : '',
    paymentMethod: initialData.paymentMethod || 'Cash',
    proof: null
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'proof') {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.amount || formData.amount <= 0) {
      newErrors.amount = 'Please enter a valid amount';
    }
    
    if (!formData.from) {
      newErrors.from = 'Please enter who you borrowed from';
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
        const submissionData = new FormData();
        for (const key in formData) {
          submissionData.append(key, formData[key]);
        }
        
        await onSubmit(submissionData);
      } catch (error) {
        console.error('Error submitting form:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
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
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="from">
          From
        </label>
        <input
                    className={`shadow appearance-none border ${errors.from ? 'border-red-500' : 'border-gray-300'} rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
          id="from"
          name="from"
          type="text"
          placeholder="Who did you borrow from?"
          value={formData.from}
          onChange={handleChange}
        />
        {errors.from && <p className="text-red-500 text-xs italic mt-1">{errors.from}</p>}
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
          placeholder="Purpose of borrowing"
          value={formData.description}
          onChange={handleChange}
        />
      </div>
      
      <div>
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="date">
          Date Borrowed
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
      
      <div>
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="dueDate">
          Due Date (Optional)
        </label>
        <input
          className="shadow appearance-none border border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="dueDate"
          name="dueDate"
          type="date"
          value={formData.dueDate}
          onChange={handleChange}
        />
      </div>

      <div>
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="paymentMethod">
          Payment Method
        </label>
        <select
          className="shadow appearance-none border border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="paymentMethod"
          name="paymentMethod"
          value={formData.paymentMethod}
          onChange={handleChange}
        >
          <option value="Cash">Cash</option>
          <option value="Online">Online</option>
          <option value="Other">Other</option>
        </select>
      </div>

      {formData.paymentMethod === 'Online' && (
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="proof">
            Proof of Payment
          </label>
          <input
            className="shadow appearance-none border border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="proof"
            name="proof"
            type="file"
            onChange={handleChange}
          />
        </div>
      )}
      
      <div className="flex items-center justify-end">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
          type="submit"
          disabled={loading}
        >
          {loading ? (isEditing ? 'Updating...' : 'Adding...') : (isEditing ? 'Update Borrowing' : 'Add Borrowing')}
        </button>
      </div>
    </form>
  );
};

export default BorrowingForm;
