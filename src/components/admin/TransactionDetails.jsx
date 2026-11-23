import React, { useState } from 'react';
import { Copy, Check, User, Gamepad2, Hash, DollarSign, Calendar } from 'lucide-react';
import { doCopy } from '../../supabaseClient';
import { formatBDT, formatDateTime } from '../../utils/formatters';
import Card from '../ui/Card';

const TransactionDetails = ({ tx, type }) => {
  const [copiedField, setCopiedField] = useState('');

  const handleCopy = (text, field) => {
    doCopy(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(''), 2000);
  };

  const CopyBtn = ({ text, field }) => (
    <button onClick={() => handleCopy(text, field)} className="ml-2 p-1 text-gray-400 hover:text-purple-500 transition">
      {copiedField === field ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
    </button>
  );

  return (
    <div className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-xl border border-gray-100 dark:border-gray-700 space-y-2 text-sm">
      {/* ইউজার আইডি */}
      <div className="flex justify-between items-center">
        <span className="text-gray-500 flex items-center gap-1"><User className="w-3.5 h-3.5" /> User ID</span>
        <div className="flex items-center">
          <span className="font-mono font-bold text-gray-800 dark:text-gray-200 text-xs truncate max-w-[120px]">{tx.user_id}</span>
          <CopyBtn text={tx.user_id} field="userId" />
        </div>
      </div>

      {/* অর্ডার / ট্রানজেকশন আইডি */}
      <div className="flex justify-between items-center">
        <span className="text-gray-500 flex items-center gap-1"><Hash className="w-3.5 h-3.5" /> {type === 'order' ? 'Order ID' : 'Trx ID'}</span>
        <div className="flex items-center">
          <span className="font-mono font-bold text-purple-600 dark:text-purple-400 text-xs truncate max-w-[120px]">{tx.id}</span>
          <CopyBtn text={tx.id} field="id" />
        </div>
      </div>

      {/* অর্ডার হলে গেম ও প্লেয়ার আইডি */}
      {type === 'order' && (
        <>
          <div className="flex justify-between items-center">
            <span className="text-gray-500 flex items-center gap-1"><Gamepad2 className="w-3.5 h-3.5" /> Game</span>
            <span className="font-bold text-gray-800 dark:text-gray-200 text-xs">{tx.game_name || 'N/A'}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-500 flex items-center gap-1"><User className="w-3.5 h-3.5" /> Player UID</span>
            <span className="font-mono font-bold text-gray-800 dark:text-gray-200 text-xs">{tx.player_id || 'N/A'}</span>
          </div>
        </>
      )}

      {/* ডিপোজিট/উইথড্র হলে মেথড ও একাউন্ট */}
      {type === 'transaction' && (
        <div className="flex justify-between items-center">
          <span className="text-gray-500 flex items-center gap-1"><Hash className="w-3.5 h-3.5" /> Account / Method</span>
          <span className="font-bold text-gray-800 dark:text-gray-200 text-xs">{tx.method?.toUpperCase()} - {tx.reference || 'N/A'}</span>
        </div>
      )}

      {/* পরিমাণ */}
      <div className="flex justify-between items-center pt-2 border-t border-gray-200 dark:border-gray-700">
        <span className="text-gray-500 flex items-center gap-1"><DollarSign className="w-3.5 h-3.5" /> Amount</span>
        <span className="font-bold text-green-600 dark:text-green-400">{formatBDT(tx.amount)}</span>
      </div>

      {/* তারিখ */}
      <div className="flex justify-between items-center">
        <span className="text-gray-500 flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> Date</span>
        <span className="text-xs text-gray-600 dark:text-gray-400">{formatDateTime(tx.created_at)}</span>
      </div>
    </div>
  );
};

export default TransactionDetails;
