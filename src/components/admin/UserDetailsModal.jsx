import React, { useState, useEffect } from 'react';
import { X, Eye, EyeOff, Wallet, Receipt, User, Shield, Lock } from 'lucide-react';
import { supabase } from '../../supabaseClient';
import { formatBDT, formatDateTime } from '../../utils/formatters';
import Modal from '../ui/Modal';
import Badge from '../ui/Badge';

const UserDetailsModal = ({ isOpen, onClose, user }) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPin, setShowPin] = useState(false);

  useEffect(() => {
    if (isOpen && user) {
      const fetchTx = async () => {
        setLoading(true);
        const { data } = await supabase
          .from('transactions')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(10);
        setTransactions(data || []);
        setLoading(false);
      };
      fetchTx();
    }
  }, [isOpen, user]);

  if (!user) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="User Details" size="lg" showCloseButton={false}>
      <div className="relative">
        {/* ক্লোজ বাটন */}
        <button onClick={onClose} className="absolute -top-2 -right-2 p-2 bg-gray-100 dark:bg-gray-800 rounded-full text-gray-500 hover:text-red-500 transition z-10">
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-6">
          {/* ইউজার প্রোফাইল */}
          <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-700">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white text-2xl font-bold">
              {user.email?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">{user.full_name || 'No Name'}</h2>
              <p className="text-sm text-gray-500">{user.email}</p>
              <div className="flex gap-2 mt-2">
                <Badge variant={user.role === 'admin' ? 'warning' : 'gray'} size="sm">
                  {user.role === 'admin' ? 'Admin' : 'User'}
                </Badge>
                <Badge variant="info" size="sm">ID: {user.id.slice(0, 8)}</Badge>
              </div>
            </div>
          </div>

          {/* ওয়ালেট এবং পিন */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-100 dark:border-green-800">
              <div className="flex items-center gap-2 mb-2">
                <Wallet className="w-5 h-5 text-green-600" />
                <p className="text-xs font-bold text-green-700 dark:text-green-300">Wallet Balance</p>
              </div>
              <p className="text-2xl font-black text-green-600 dark:text-green-400">{formatBDT(user.balance || 0)}</p>
            </div>

            <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-100 dark:border-purple-800 relative">
              <div className="flex items-center gap-2 mb-2">
                <Lock className="w-5 h-5 text-purple-600" />
                <p className="text-xs font-bold text-purple-700 dark:text-purple-300">Transaction PIN</p>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-2xl font-black text-purple-600 dark:text-purple-400 tracking-widest">
                  {showPin ? (user.transaction_pin || 'Not Set') : '••••'}
                </p>
                <button onClick={() => setShowPin(!showPin)} className="p-2 bg-purple-100 dark:bg-purple-900/40 rounded-lg text-purple-600 hover:bg-purple-200 transition">
                  {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {!user.transaction_pin && <p className="text-[10px] text-red-500 mt-1">⚠️ PIN not set yet</p>}
            </div>
          </div>

          {/* ট্রানজেকশন */}
          <div>
            <h3 className="text-sm font-bold text-gray-800 dark:text-white mb-3 flex items-center gap-2">
              <Receipt className="w-4 h-4 text-gray-500" /> Recent Transactions
            </h3>
            {loading ? (
              <p className="text-center text-gray-500 text-sm py-4">Loading transactions...</p>
            ) : transactions.length === 0 ? (
              <p className="text-center text-gray-500 text-sm py-4">No transactions found.</p>
            ) : (
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {transactions.map(tx => (
                  <div key={tx.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-100 dark:border-gray-700">
                    <div>
                      <p className="text-xs font-bold text-gray-800 dark:text-white uppercase">{tx.type}</p>
                      <p className="text-[10px] text-gray-500">{formatDateTime(tx.created_at)}</p>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-bold ${Number(tx.amount) > 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {Number(tx.amount) > 0 ? '+' : ''}{formatBDT(tx.amount)}
                      </p>
                      <Badge variant={tx.status === 'completed' ? 'success' : 'warning'} size="sm">{tx.status}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default UserDetailsModal;
