
import React, { useState } from 'react';
import { X, Upload, Loader2, CheckCircle } from 'lucide-react';
import client from '../src/api/client';

interface InvoiceUploadModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

const InvoiceUploadModal: React.FC<InvoiceUploadModalProps> = ({ onClose, onSuccess }) => {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [retailerEmail, setRetailerEmail] = useState(''); // Simplified for prototype
  const [isLoading, setIsLoading] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await client.post('/invoices/', {
        amount: parseFloat(amount),
        description,
        due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        // In a real app we would select from a list of retailers
        // For prototype we'll let the backend handle matching or mock it
      });
      setIsDone(true);
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to upload invoice');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-kaziflow-blue/80 backdrop-blur-sm">
      <div className="bg-white rounded-3xl p-8 w-full max-w-lg shadow-2xl relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <X size={24} />
        </button>

        <div className="mb-8">
          <h3 className="text-2xl font-heading font-bold text-kaziflow-blue mb-2">Upload New Invoice</h3>
          <p className="text-gray-500 text-sm">Submit your invoice for retailer verification and instant financing.</p>
        </div>

        {isDone ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
              <CheckCircle size={32} />
            </div>
            <h4 className="text-xl font-bold text-kaziflow-blue mb-2">Upload Successful!</h4>
            <p className="text-gray-500">Your invoice has been submitted and a QR code generated.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && <div className="p-3 bg-red-100 text-red-700 text-sm rounded-lg">{error}</div>}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Retailer Email / ID</label>
              <input
                type="text"
                value={retailerEmail}
                onChange={e => setRetailerEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-kaziflow-blue"
                placeholder="simba@retail.rw"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Invoice Amount (RWF)</label>
              <input
                type="number"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-kaziflow-blue"
                placeholder="500000"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description / Goods Supplied</label>
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-kaziflow-blue"
                placeholder="Supply of 200 units of..."
                rows={3}
                required
              />
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-kaziflow-blue text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-kaziflow-blueLight transition-all"
              >
                {isLoading ? <Loader2 className="animate-spin" size={20} /> : <><Upload size={20} /> Submit Invoice</>}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default InvoiceUploadModal;
