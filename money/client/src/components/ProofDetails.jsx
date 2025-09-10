import React, { useState, useEffect } from 'react';
  import { useParams, Link } from 'react-router-dom';
  import { receiptService } from '../services/receiptService';
  import { format } from 'date-fns';

  const ProofDetails = () => {
    const { id } = useParams();
    const [receipt, setReceipt] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
      const fetchReceiptDetails = async () => {
        try {
          setLoading(true);
          const data = await receiptService.getReceiptById(id);
          setReceipt(data);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };

      fetchReceiptDetails();
    }, [id]);

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

    if (!receipt) {
      return (
        <div className="container mx-auto px-4 py-6 text-center">
          <p className="text-gray-500">Receipt not found.</p>
        </div>
      );
    }

    return (
      <div className="container mx-auto px-4 py-6">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold mb-4">Proof Statement Details</h1>

          <div className="mb-4">
            <p className="text-gray-600"><strong>Type:</strong> {receipt.transactionType}</p>
            <p className="text-gray-600"><strong>Amount:</strong> ₹{receipt.amount.toFixed(2)}</p>
            <p className="text-gray-600"><strong>Date:</strong> {format(new Date(receipt.date), 'MMM dd, yyyy')}</p>
            <p className="text-gray-600"><strong>Description:</strong> {receipt.description || 'N/A'}</p>

            {receipt.transactionType === 'Borrowing' && (
              <>
                <p className="text-gray-600"><strong>Repay Date:</strong> {receipt.repayDate ? format(new Date(receipt.repayDate), 'MMM dd, yyyy') : 'N/A'}</p>
                <p className="text-gray-600"><strong>Payment Method:</strong> {receipt.paymentMethod || 'N/A'}</p>
              </>
            )}
          </div>

          {receipt.proof && ( // This condition checks if a proof image path exists
            <div className="mt-6">
              <h2 className="text-xl font-semibold mb-2">Proof Image</h2>
              <img
                src={`http://localhost:5000/${receipt.proof}`} // The image source is constructed here
                alt="Proof of Transaction"
                className="max-w-full h-auto rounded-lg shadow-md"
              />
            </div>
          )}

          <div className="mt-6">
            <Link to="/receipts" className="text-blue-600 hover:underline">
              &larr; Back to Receipts
            </Link>
          </div>
        </div>
      </div>
    );
  };

  export default ProofDetails;ils;