import React, { useState, useEffect } from 'react';
import { receiptService } from '../services/receiptService';
import { Link } from 'react-router-dom';

const Receipts = () => {
  const [receipts, setReceipts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReceipts = async () => {
      try {
        const data = await receiptService.getReceipts();
        setReceipts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReceipts();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
        {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">Receipts</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {receipts.map(receipt => (
          <div key={receipt._id} className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">{receipt.transactionType} Receipt</h2>
            <p><strong>Amount:</strong> ₹{receipt.amount.toFixed(2)}</p>
            <p><strong>Date:</strong> {new Date(receipt.date).toLocaleDateString()}</p>
            <p><strong>Description:</strong> {receipt.description || 'N/A'}</p>
            {receipt.transactionType === 'Borrowing' && (
              <>
                <p><strong>Repay Date:</strong> {receipt.repayDate ? new Date(receipt.repayDate).toLocaleDateString() : 'N/A'}</p>
                <p><strong>Payment Method:</strong> {receipt.paymentMethod || 'N/A'}</p>
              </>
            )}
            {receipt.proof && (
              <div className="mt-4">
                <p><strong>Proof of Payment:</strong></p>
                <img src={`http://localhost:5000/${receipt.proof}`} alt="Proof" className="max-w-full h-auto rounded" />
                <Link to={`/receipts/${receipt._id}`} className="block mt-2 text-blue-600 hover:underline">
                  View Details
                </Link>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Receipts;
