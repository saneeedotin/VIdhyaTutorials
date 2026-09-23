import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { QrCode, Phone, Mail, FileCheck, IndianRupee, Clock, CheckCircle } from 'lucide-react';
import { apiClient } from '../../../api/apiClient';

interface Receipt {
  _id: string;
  transactionId: string;
  amount: number;
  paymentDate: string;
  receiptUrl?: string;
  status: 'PENDING VERIFICATION' | 'VERIFIED' | 'REJECTED';
}

export function FeeLedger() {
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [transactionId, setTransactionId] = useState('');
  const [amount, setAmount] = useState('');
  const [receiptImage, setReceiptImage] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchReceipts();
  }, []);

  const fetchReceipts = () => {
    apiClient.get('/api/student/fees/receipts')
      .then(res => {
        if (res.data.success) {
          setReceipts(res.data.data);
        }
      })
      .catch(console.error);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setReceiptImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadReceipt = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!transactionId || !amount) return;

    setIsSubmitting(true);
    try {
      const res = await apiClient.post('/api/student/fees/receipt', {
        transactionId,
        amount,
        paymentDate: new Date().toISOString(),
        receiptUrl: receiptImage
      });
      
      if (res.data.success) {
        setTransactionId('');
        setAmount('');
        setReceiptImage('');
        fetchReceipts(); // Refresh history
      }
    } catch (error) {
      console.error(error);
      alert('Failed to upload receipt. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    const d = new Date(dateString);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      className="flex flex-col gap-8 w-full h-full text-on-surface pb-12 bg-transparent"
    >
      <div className="flex flex-col gap-2">
        <h1 className="text-[32px] font-h1 font-semibold tracking-tight mb-2 text-primary">
          Fee Ledger
        </h1>
        <p className="text-on-surface-variant text-sm font-medium">Manage your payments and upload transaction receipts.</p>
      </div>

      <div className="flex flex-col gap-8 flex-1 w-full max-w-4xl items-stretch">
        
        {/* UPLOAD & HISTORY */}
        <div className="flex flex-col gap-8 w-full">
          
          {/* Upload Receipt */}
          <div className="bg-surface border border-outline-variant/30 rounded-2xl p-6 shadow-sm flex flex-col gap-6">
            <div className="flex items-center gap-3 border-b border-outline-variant/30 pb-4">
              <div className="bg-primary/10 p-2 rounded-lg">
                <FileCheck className="w-6 h-6 text-primary" />
              </div>
              <h2 className="text-[24px] font-h2 font-semibold text-primary">Upload Receipt</h2>
            </div>
            
            <form onSubmit={handleUploadReceipt} className="flex flex-col gap-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex flex-col gap-2 flex-1">
                  <label className="text-sm font-semibold text-on-surface">Transaction ID / UTR Number</label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g., 312345678901"
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-outline-variant/50 bg-surface-container-low focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-medium text-on-surface transition-all"
                  />
                </div>
                <div className="flex flex-col gap-2 flex-1">
                  <label className="text-sm font-semibold text-on-surface">Amount Paid (₹)</label>
                  <div className="relative">
                    <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant" />
                    <input 
                      type="number" 
                      required
                      placeholder="5000"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 rounded-lg border border-outline-variant/50 bg-surface-container-low focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-medium text-on-surface transition-all"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-on-surface">Upload Receipt Image</label>
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full px-4 py-3 rounded-lg border border-outline-variant/50 bg-surface-container-low focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-medium text-on-surface transition-all file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-medium file:bg-surface-container file:text-on-surface hover:file:bg-surface-container-high hover:file:cursor-pointer"
                  />
                  {receiptImage && (
                    <div className="mt-2 w-32 h-32 rounded-xl overflow-hidden border border-outline-variant/30">
                      <img src={receiptImage} alt="Receipt preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
              </div>
              
              <button 
                type="submit"
                disabled={isSubmitting}
                className="mt-2 w-full bg-primary text-white dark:text-[#001b3c] hover:bg-primary/90 font-medium py-3 rounded-lg flex items-center justify-center gap-2 transition-all shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Saving...' : 'Save Receipt'}
              </button>
            </form>
          </div>

          {/* Payment History */}
          <div className="bg-surface border border-outline-variant/30 rounded-2xl p-6 shadow-sm flex flex-col gap-6">
            <div className="flex items-center gap-3 border-b border-outline-variant/30 pb-4">
              <div className="bg-primary/10 p-2 rounded-lg">
                <Clock className="w-6 h-6 text-primary" />
              </div>
              <h2 className="text-[24px] font-h2 font-semibold text-primary">Payment History</h2>
            </div>

            <div className="flex flex-col gap-4">
              {receipts.length === 0 ? (
                <p className="text-on-surface-variant font-medium py-4">No receipts uploaded yet.</p>
              ) : (
                receipts.map(receipt => (
                  <div key={receipt._id} className="flex flex-col md:flex-row md:items-center justify-between p-5 rounded-2xl border border-outline-variant/30 hover:bg-surface-container-low transition-all shadow-sm gap-4">
                    <div className="flex flex-col gap-1">
                      <p className="text-on-surface-variant text-xs font-semibold uppercase tracking-wider">Transaction ID</p>
                      <p className="font-medium text-lg text-on-surface">{receipt.transactionId}</p>
                      <p className="text-on-surface-variant text-sm font-medium mt-1">{formatDate(receipt.paymentDate)}</p>
                      {receipt.receiptUrl && (
                        <a href={receipt.receiptUrl} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-primary hover:underline flex items-center gap-1 mt-1">
                          <FileCheck className="w-4 h-4" /> View Receipt
                        </a>
                      )}
                    </div>

                    <div className="flex flex-col md:items-end gap-2 shrink-0">
                      <p className="font-h3 font-semibold text-2xl text-primary">₹{receipt.amount}</p>
                      {receipt.status === 'VERIFIED' ? (
                        <span className="flex items-center gap-1 text-xs font-semibold bg-emerald-50 text-emerald-600 px-3 py-1 rounded-md">
                          <CheckCircle className="w-3 h-3" /> VERIFIED
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-xs font-semibold bg-orange-50 text-orange-500 px-3 py-1 rounded-md">
                          <Clock className="w-3 h-3" /> PENDING
                        </span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      </div>
    </motion.div>
  );
}
