import React, { useState } from 'react';

const RepaymentForm = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    repaidDate: new Date().toISOString().split('T')[0],
    repaymentNotes: '',
    proof: null
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'proof') {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const submissionData = new FormData();
      for (const key in formData) {
        if (formData[key]) {
          submissionData.append(key, formData[key]);
        }
      }
      await onSubmit(submissionData);
    } catch (error) {
      console.error('Failed to submit repayment', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="repaidDate" className="block text-sm font-medium text-gray-700">Repayment Date</label>
        <input
          type="date"
          id="repaidDate"
          name="repaidDate"
          value={formData.repaidDate}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
      </div>
      <div>
        <label htmlFor="repaymentNotes" className="block text-sm font-medium text-gray-700">Notes (Optional)</label>
        <textarea
          id="repaymentNotes"
          name="repaymentNotes"
          rows="3"
          value={formData.repaymentNotes}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          placeholder="e.g., Paid via GPay"
        ></textarea>
      </div>
      <div>
        <label htmlFor="proof" className="block text-sm font-medium text-gray-700">Proof of Payment (Optional)</label>
        <input
          type="file"
          id="proof"
          name="proof"
          onChange={handleChange}
          className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
      </div>
      <div className="flex justify-end gap-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Submitting...' : 'Confirm Repayment'}
        </button>
      </div>
    </form>
  );
};

export default RepaymentForm;
