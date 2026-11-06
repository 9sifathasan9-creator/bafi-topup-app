import React, { useState } from 'react';
import { Copy, Check, RotateCw, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { formatBDT, formatDateTime, formatOrderId } from '../../utils/formatters';
import { doCopy } from '../../supabaseClient';
import OrderStatus from './OrderStatus';
import ReceiptModal from './ReceiptModal';

const OrderCard = ({ order }) => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);

  if (!order) return null;

  const handleCopy = () => {
    doCopy(order.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleBuyAgain = () => {
    if (order.game_id) {
      navigate(`/games/${order.game_id}`);
    } else {
      navigate('/games');
    }
  };

  const title = order.notes || order.game_name || 'Top-up';
  const subtitle = order.game_name || 'Game Top-up';

  return (
    <>
      <div className="gaming-card p-4 rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm mb-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-900/20 border border-purple-100 dark:border-purple-800/30 flex items-center justify-center flex-shrink-0">
              <img src="/icon-192.png" alt="Logo" className="w-7 h-7 rounded-md object-cover" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-800 dark:text-white line-clamp-1">{title}</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{subtitle}</p>
            </div>
          </div>
          <OrderStatus status={order.status} />
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-y-3 gap-x-4 mb-4">
          <div>
            <p className="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1">{t('orderId') || 'Order ID'}</p>
            <div className="flex items-center gap-1.5">
              <p className="text-xs font-bold text-purple-600 dark:text-purple-400 font-mono">{formatOrderId(order.id)}</p>
              <button onClick={handleCopy} className="text-gray-400 hover:text-purple-500 transition">
                {copied ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
              </button>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1">{t('date') || 'Date'}</p>
            <p className="text-xs font-medium text-gray-700 dark:text-gray-300">{formatDateTime(order.created_at)}</p>
          </div>
          <div>
            <p className="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1">Player ID</p>
            <p className="text-xs font-medium text-gray-700 dark:text-gray-300">{order.player_id || 'N/A'}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1">{t('amount') || 'Amount'}</p>
            <p className="text-sm font-bold text-gray-800 dark:text-white">{formatBDT(order.amount)}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 pt-3 border-t border-gray-100 dark:border-gray-800">
          <button onClick={() => setShowReceipt(true)} className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg text-xs font-bold hover:bg-gray-200 dark:hover:bg-gray-700 transition">
            <FileText className="w-3.5 h-3.5" /> Receipt
          </button>
          <button onClick={handleBuyAgain} className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 rounded-lg text-xs font-bold hover:bg-purple-200 dark:hover:bg-purple-900/50 transition">
            <RotateCw className="w-3.5 h-3.5" /> Buy Again
          </button>
        </div>
      </div>

      <ReceiptModal isOpen={showReceipt} onClose={() => setShowReceipt(false)} order={order} />
    </>
  );
};
export default OrderCard;
