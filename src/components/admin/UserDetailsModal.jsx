import React, { useState, useEffect } from 'react';
import { X, Eye, EyeOff, Wallet, Receipt, Lock, ArrowUpRight, ArrowDownLeft, Copy, Check } from 'lucide-react';
import { supabase, doCopy } from '../../supabaseClient';
import { formatBDT, formatDateTime } from '../../utils/formatters';
import Modal from '../ui/Modal';
import Badge from '../ui/Badge';

const UserDetailsModal = ({ isOpen, onClose, user }) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPin, setShowPin] = useState(false);
  const [selectedTx, setSelectedTx] = useState(null);
  const [copiedField, setCopiedField] = useState('');

  useEffect(() => {
    if (isOpen && user) {
      const fetchTx = async () => {
        setLoading(true);
        const { data } = await supabase
          .from('transactions')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
        setTransactions(data || []);
        setLoading(false);
      };
      fetchTx();
    }
  }, [isOpen, user]);

  const handleCopy = (text, field) => {
    doCopy(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(''), 2000);
  };

  const CopyBtn = ({ text, field }) => (
    <button onClick={(e) => { e.stopPropagation(); handleCopy(text, field); }} className="ml-2 p-1 text-gray-400 hover:text-purple-500 transition">
      {copiedField === field ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
    </button>
  );

  if (!user) return null;

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} title="User Details" size="lg" showCloseButton={false}>
        <div className="relative">
          <button onClick={onClose} className="absolute -top-2 -right-2 p-2 bg-gray-100 dark:bg-gray-800 rounded-full text-gray-500 hover:text-red-500 transition z-10">
            <X className="w-5 h-5" />
          </button>

          <div className="space-y-6">
            {/* প্রোফাইল */}
            <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-700">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white text-2xl font-bold">
                {user.email?.charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800 dark:text-white">{user.full_name || 'No Name'}</h2>
                <p className="text-sm text-gray-500">{user.email}</p>
                <div className="flex gap-2 mt-2">
                  <Badge variant={user.role === 'admin' ? 'warning' : 'gray'} size="sm">{user.role === 'admin' ? 'Admin' : 'User'}</Badge>
                  <Badge variant="info" size="sm">ID: {user.id.slice(0, 8)}</Badge>
                </div>
              </div>
            </div>

            {/* ওয়ালেট ও পিন */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-100 dark:border-green-800">
                <div className="flex items-center gap-2 mb-2"><Wallet className="w-5 h-5 text-green-600" /><p className="text-xs font-bold text-green-700 dark:text-green-300">Wallet Balance</p></div>
                <p className="text-2xl font-black text-green-600 dark:text-green-400">{formatBDT(user.balance || 0)}</p>
              </div>
              <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-100 dark:border-purple-800">
                <div className="flex items-center gap-2 mb-2"><Lock className="w-5 h-5 text-purple-600" /><p className="text-xs font-bold text-purple-700 dark:text-purple-300">Transaction PIN</p></div>
                <div className="flex items-center justify-between">
                  <p className="text-2xl font-black text-purple-600 tracking-widest">{showPin ? (user.transaction_pin || 'Not Set') : '••••'}</p>
                  <button onClick={() => setShowPin(!showPin)} className="p-2 bg-purple-100 dark:bg-purple-900/40 rounded-lg text-purple-600 hover:bg-purple-200 transition">{showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button>
                </div>
              </div>
            </div>

            {/* ট্রানজেকশন লিস্ট */}
            <div>
              <h3 className="text-sm font-bold text-gray-800 dark:text-white mb-3 flex items-center gap-2"><Receipt className="w-4 h-4 text-gray-500" /> Transaction History</h3>
              {loading ? <p className="text-center text-gray-500 text-sm py-4">Loading...</p> : transactions.length === 0 ? (
                <p className="text-center text-gray-500 text-sm py-4">No transactions found.</p>
              ) : (
                <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                  {transactions.map(tx => (
                    <div key={tx.id} onClick={() => setSelectedTx(tx)} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-100 dark:border-gray-700 cursor-pointer hover:bg-gray-100 transition">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${Number(tx.amount) > 0 ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                          {Number(tx.amount) > 0 ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-gray-800 dark:text-white uppercase">{tx.type}</p>
                          <p className="text-[10px] text-gray-500">{formatDateTime(tx.created_at)}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`text-sm font-bold ${Number(tx.amount) > 0 ? 'text-green-500' : 'text-red-500'}`}>{Number(tx.amount) > 0 ? '+' : ''}{formatBDT(tx.amount)}</p>
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

      {/* ট্রানজেকশন ডিটেইলস মডাল (টাইপ অনুযায়ী আলাদা) */}
      <Modal isOpen={!!selectedTx} onClose={() => setSelectedTx(null)} title="Transaction Details" size="sm">
        {selectedTx && (
          <div className="space-y-3 bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl text-sm">
            
            {/* সাধারণ তথ্য */}
            <div className="flex justify-between items-center">
              <span className="text-gray-500">User ID</span>
              <div className="flex items-center"><span className="font-mono text-xs text-gray-800 dark:text-gray-200 truncate max-w-[120px]">{selectedTx.user_id}</span><CopyBtn text={selectedTx.user_id} field="userId" /></div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500">Transaction ID</span>
              <div className="flex items-center"><span className="font-mono text-xs text-purple-600 truncate max-w-[120px]">{selectedTx.id}</span><CopyBtn text={selectedTx.id} field="txId" /></div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500">Type</span>
              <span className="font-bold uppercase text-xs text-gray-800 dark:text-white">{selectedTx.type}</span>
            </div>

            {/* Purchase (গেম কেনা) */}
            {selectedTx.type === 'purchase' && (
              <>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Game Name</span>
                  <span className="font-bold text-gray-800 dark:text-white text-xs">{selectedTx.game_name || 'N/A'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Item Name</span>
                  <span className="font-bold text-gray-800 dark:text-white text-xs">{selectedTx.reference || 'N/A'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Quantity</span>
                  <span className="font-bold text-gray-800 dark:text-white text-xs">{selectedTx.amount ? 1 : 0}</span>
                </div>
              </>
            )}

            {/* Cash In (Deposit) */}
            {selectedTx.type === 'deposit' && (
              <>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Method</span>
                  <span className="font-bold uppercase text-xs text-gray-800 dark:text-white">{selectedTx.method}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Sender Number</span>
                  <div className="flex items-center"><span className="font-mono text-xs text-gray-800 dark:text-gray-200">{selectedTx.sender_number || 'N/A'}</span><CopyBtn text={selectedTx.sender_number || ''} field="sender" /></div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Agent / TRX ID</span>
                  <div className="flex items-center"><span className="font-mono text-xs text-gray-800 dark:text-gray-200">{selectedTx.reference || 'N/A'}</span><CopyBtn text={selectedTx.reference || ''} field="trx" /></div>
                </div>
              </>
            )}

            {/* Cash Out (Withdrawal) */}
            {selectedTx.type === 'withdrawal' && (
              <>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Method</span>
                  <span className="font-bold uppercase text-xs text-gray-800 dark:text-white">{selectedTx.method}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Receiver Number</span>
                  <div className="flex items-center"><span className="font-mono text-xs text-gray-800 dark:text-gray-200">{selectedTx.reference || 'N/A'}</span><CopyBtn text={selectedTx.reference || ''} field="receiver" /></div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Agent TRX ID</span>
                  <div className="flex items-center"><span className="font-mono text-xs text-gray-800 dark:text-gray-200">{selectedTx.agent_trx_id || 'N/A'}</span><CopyBtn text={selectedTx.agent_trx_id || ''} field="agentTrx" /></div>
                </div>
              </>
            )}

            {/* পরিমাণ ও স্ট্যাটাস */}
            <div className="flex justify-between items-center pt-2 border-t border-gray-200 dark:border-gray-700">
              <span className="text-gray-500">Amount</span>
              <span className={`font-bold text-base ${Number(selectedTx.amount) > 0 ? 'text-green-600' : 'text-red-600'}`}>{Number(selectedTx.amount) > 0 ? '+' : ''}{formatBDT(selectedTx.amount)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500">Status</span>
              <Badge variant={selectedTx.status === 'completed' ? 'success' : 'warning'} size="sm">{selectedTx.status}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500">Date</span>
              <span className="text-xs text-gray-600">{formatDateTime(selectedTx.created_at)}</span>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
};

export default UserDetailsModal;
