import React from 'react';
import { X, CheckCircle, Clock, XCircle } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { formatBDT, formatDateTime, formatOrderId } from '../../utils/formatters';

const ReceiptModal = ({ isOpen, onClose, order }) => {
  const { t } = useLanguage();
  if (!isOpen || !order) return null;

  const isSuccess = order.status === 'completed' || order.status === 'success';
  const isPending = order.status === 'pending';
  const StatusIcon = isSuccess ? CheckCircle : isPending ? Clock : XCircle;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={onClose}>
      <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl animate-slide-up" onClick={e => e.stopPropagation()}>
        {/* Receipt Header */}
        <div className={`p-6 text-center ${isSuccess ? 'bg-green-50 dark:bg-green-900/20' : isPending ? 'bg-yellow-50 dark:bg-yellow-900/20' : 'bg-red-50 dark:bg-red-900/20'}`}>
          <StatusIcon className={`w-12 h-12 mx-auto mb-2 ${isSuccess ? 'text-green-500' : isPending ? 'text-yellow-500' : 'text-red-500'}`} />
          <h2 className="text-lg font-bold text-gray-800 dark:text-white">
            {isSuccess ? 'Payment Successful' : isPending ? 'Payment Pending' : 'Payment Failed'}
          </h2>
          <p className="text-2xl font-black text-gray-800 dark:text-white mt-1">{formatBDT(order.amount)}</p>
        </div>

        {/* Receipt Body */}
        <div className="p-5 space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Order ID</span>
            <span className="font-bold text-gray-800 dark:text-white font-mono">{formatOrderId(order.id)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Date</span>
            <span className="font-medium text-gray-800 dark:text-white">{formatDateTime(order.created_at)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Game</span>
            <span className="font-medium text-gray-800 dark:text-white">{order.game_name || 'Top-up'}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Player ID</span>
            <span className="font-medium text-gray-800 dark:text-white">{order.player_id || 'N/A'}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Method</span>
            <span className="font-medium text-gray-800 dark:text-white capitalize">{order.payment_method || 'Wallet'}</span>
          </div>
          
          <div className="border-t border-dashed border-gray-200 dark:border-gray-700 pt-3 mt-3">
            <div className="flex justify-between font-bold text-lg">
              <span className="text-gray-800 dark:text-white">Total</span>
              <span className="text-purple-600 dark:text-purple-400">{formatBDT(order.amount)}</span>
            </div>
          </div>
        </div>

        {/* Close Button */}
        <div className="p-4 bg-gray-50 dark:bg-gray-900 border-t border-gray-100 dark:border-gray-700">
          <button onClick={onClose} className="w-full py-2.5 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white font-bold rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 transition">
            Close Receipt
          </button>
        </div>
      </div>
    </div>
  );
};
export default ReceiptModal;
