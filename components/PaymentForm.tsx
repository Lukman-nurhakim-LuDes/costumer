// components/PaymentForm.tsx
'use client';

import { useState } from 'react';
import { createPayment } from '@/actions/payment';
import { DollarSign } from 'lucide-react';

interface PaymentFormProps {
  bookingId: string;
  remainingDue: number;
}

export default function PaymentForm({ bookingId, remainingDue }: PaymentFormProps) {
  const [status, setStatus] = useState<{ message: string, success: boolean } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState(remainingDue > 0 ? remainingDue : 0);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setStatus(null);

    const formData = new FormData(event.currentTarget);
    const paymentStatus = formData.get('paymentStatus') as 'DP Paid' | 'Fully Paid';
    
    // Data Pembayaran
    const paymentData = {
        bookingId: bookingId,
        amount: String(paymentAmount),
        paymentStatus: paymentStatus,
    };

    // Validasi Sederhana
    if (paymentAmount <= 0) {
        setStatus({ success: false, message: 'Jumlah pembayaran harus lebih dari Rp 0.' });
        setIsLoading(false);
        return;
    }

    // Panggil Server Action
    const result = await createPayment(paymentData);
    
    setStatus(result);
    setIsLoading(false);

    // Reset jika sukses
    if (result.success) {
      // Tidak perlu reset form, hanya memperbarui state
      setPaymentAmount(0);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 pt-3">
      <h3 className="text-lg font-semibold text-gray-800 flex items-center mb-3">
        <DollarSign className="w-5 h-5 mr-2 text-indigo-500" /> Catat Pembayaran
      </h3>

      {/* Notifikasi Status */}
      {status && (
        <div className={`p-2 rounded-lg text-xs ${status.success ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {status.message}
        </div>
      )}
      
      {/* Sisa Tagihan Info */}
      <p className="text-sm text-gray-600">
        Sisa Tagihan: <span className="font-bold text-red-600">Rp{remainingDue.toLocaleString('id-ID')}</span>
      </p>

      {/* Jumlah Pembayaran */}
      <div>
        <label htmlFor="amount" className="block text-xs font-medium text-gray-700">Jumlah yang Dibayar (Rp)</label>
        <input
          type="number"
          id="amount"
          name="amount"
          step="0.01"
          value={paymentAmount}
          onChange={(e) => setPaymentAmount(parseFloat(e.target.value) || 0)}
          required
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm"
          disabled={isLoading}
        />
      </div>

      {/* Status Pembayaran */}
      <div>
        <label htmlFor="paymentStatus" className="block text-xs font-medium text-gray-700">Status Pembayaran</label>
        <select
          id="paymentStatus"
          name="paymentStatus"
          required
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm"
          disabled={isLoading}
        >
          <option value="DP Paid">DP (Down Payment)</option>
          <option value="Fully Paid">Lunas (Fully Paid)</option>
        </select>
      </div>

      <button
        type="submit"
        className="w-full bg-indigo-600 text-white text-sm font-semibold py-2 rounded-xl shadow-md hover:bg-indigo-700 transition-colors"
        disabled={isLoading || remainingDue <= 0}
      >
        {isLoading ? 'Mencatat...' : 'Catat Pembayaran'}
      </button>

      {remainingDue <= 0 && <p className="text-xs text-green-600 mt-2">Tagihan ini sudah lunas.</p>}
    </form>
  );
}