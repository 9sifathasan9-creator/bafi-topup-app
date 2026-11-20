import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, X, History, Loader2, ShieldAlert } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useWallet } from '../../hooks/useWallet';
import { useOrders } from '../../hooks/useOrders';
import { useNotifications } from '../../hooks/useNotifications';
import { ROUTES } from '../../utils/constants';
import { supabase } from '../../supabaseClient';
import WalletCard from '../../components/wallet/WalletCard';
import AddMoney from '../../components/wallet/AddMoney';
import WithdrawMoney from '../../components/wallet/WithdrawMoney';
import TransactionList from '../../components/wallet/TransactionList';

const WalletPage = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { balance, transactions, refresh, loading } = useWallet();
  const { orders } = useOrders();
  const { notifyError } = useNotifications();
  
  const [fullScreenAction, setFullScreenAction] = useState(null); 
  const [txStatus, setTxStatus] = useState('idle'); 
  const [txError, setTxError] = useState('');

  const ordersCount = orders?.length || 0;
  const totalSpent = transactions.filter((tx) => tx.type === 'purchase' || Number(tx.amount) < 0).reduce((sum, tx) => sum + Math.abs(Number(tx.amount || 0)), 0);

  const handleAddMoney = async (data) => {
    setTxStatus('processing');
    setTxError('');
    
    const { error } = await supabase.from('transactions').insert({
      user_id: (await supabase.auth.getUser()).data.user.id,
      type: 'deposit',
      amount: data.amount,
      method: data.method,
      reference: data.trxId,
      sender_number: data.senderNumber,
      status: 'pending',
      balance_after: balance
    });

    if (!error) {
      setTxStatus('pending');
      await refresh();
    } else {
      setTxStatus('idle');
      setTxError(error.message);
      notifyError(error.message);
    }
  };

  const handleWithdrawRequest = async (data) => {
    setTxStatus('processing');
    setTxError('');
    
    const { error } = await supabase.from('transactions').insert({
      user_id: (await supabase.auth.getUser()).data.user.id,
      type: 'withdrawal',
      amount: -data.amount,
      method: data.method,
      reference: data.accountNumber,
      status: 'pending',
      balance_after: balance - data.amount
    });
    
    if (!error) { 
      setTxStatus('pending');
      await refresh(); 
    } else { 
      setTxStatus('idle');
      setTxError(error.message); 
      notifyError(error.message); 
    }
  };

  return (
    <div className="min-h-screen px-4 py-6 bg-[#f3f4f6] dark:bg-gray-900 relative">
      <div className="max-w-3xl mx-auto space-y-5">
        <button onClick={() => navigate(ROUTES.USER_DASHBOARD)} className="text-slate-700 dark:text-white/80 hover:text-purple-600 text-sm inline-flex items-center gap-2 font-medium">
          <ArrowLeft className="w-4 h-4" /> {t('back') || 'Back'}
        </button>
        
        <h1 className="text-2xl font-black text-slate-800 dark:text-white mb-2">{t('myWallet') || 'Wallet'}</h1>

        <WalletCard 
          balance={balance} 
          ordersCount={ordersCount} 
          totalSpent={totalSpent} 
          onRecharge={() => { setFullScreenAction('add'); setTxStatus('idle'); }}
          onWithdraw={() => { setFullScreenAction('withdraw'); setTxStatus('idle'); }}
        />

        <div className="gaming-card p-5 mt-6 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-2 mb-4">
            <History className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            <h3 className="text-sm font-bold text-gray-800 dark:text-white">{t('recentTransactions') || 'Recent Transactions'}</h3>
          </div>
          <TransactionList transactions={transactions} loading={loading} />
        </div>
      </div>

      {fullScreenAction && (
        <div className="fixed inset-0 z-[100] bg-[#f3f4f6] dark:bg-gray-900 overflow-y-auto flex flex-col animate-slide-up">
          <div className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-10 px-4 py-3 flex items-center justify-between">
            <button onClick={() => setFullScreenAction(null)} disabled={txStatus === 'processing'} className="flex items-center gap-1.5 text-slate-700 dark:text-white text-sm font-bold bg-gray-100 dark:bg-gray-700 px-3 py-1.5 rounded-lg hover:bg-gray-200 disabled:opacity-50">
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <h2 className="text-base font-bold text-gray-800 dark:text-white">{fullScreenAction === 'add' ? 'Add Money' : 'Withdraw'}</h2>
            <div className="w-16"></div>
          </div>

          {txStatus !== 'idle' ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
              {txStatus === 'processing' && (
                <div className="flex flex-col items-center">
                  <Loader2 className="w-16 h-16 text-purple-600 animate-spin mb-4" />
                  <h2 className="text-xl font-bold text-gray-800 dark:text-white">Processing...</h2>
                  <p className="text-sm text-gray-500 mt-2">Submitting your request.</p>
                </div>
              )}
              {txStatus === 'pending' && (
                <div className="flex flex-col items-center animate-scale-in">
                  <ShieldAlert className="w-20 h-20 text-yellow-500 mb-4" />
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Request Submitted!</h2>
                  <p className="text-sm text-gray-500 mt-2 text-center">Your request is pending admin approval.<br/>Balance will be added after verification.</p>
                  <button onClick={() => setFullScreenAction(null)} className="mt-6 px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white font-bold rounded-lg">Close</button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex-1 p-4 pb-24 max-w-md w-full mx-auto">
              {txError && <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg">{txError}</div>}
              <div className="gaming-card p-5 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 mt-2">
                {fullScreenAction === 'add' ? (
                  <AddMoney onSubmitRequest={handleAddMoney} loading={false} />
                ) : (
                  <WithdrawMoney balance={balance} onWithdrawRequest={handleWithdrawRequest} loading={false} />
                )}
              </div>
            </div>
          )}

          {txStatus === 'idle' && (
            <div className="fixed bottom-0 inset-x-0 p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
              <button onClick={() => setFullScreenAction(null)} className="w-full py-3 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600 transition flex items-center justify-center gap-2">
                <X className="w-5 h-5" /> Close
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default WalletPage;
