import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, X, Wallet, History } from 'lucide-react';
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
  const { balance, transactions, addMoney, refresh, loading } = useWallet();
  const { orders } = useOrders();
  const { notifySuccess, notifyError } = useNotifications();
  
  const [processing, setProcessing] = useState(false);
  const [fullScreenAction, setFullScreenAction] = useState(null); // 'add' | 'withdraw' | null

  const ordersCount = orders?.length || 0;
  const totalSpent = transactions.filter((tx) => tx.type === 'purchase' || Number(tx.amount) < 0).reduce((sum, tx) => sum + Math.abs(Number(tx.amount || 0)), 0);

  const handleAddMoney = async (data) => {
    setProcessing(true);
    const result = await addMoney(data.amount, data.method);
    setProcessing(false);
    if (result.success) { 
      notifySuccess(t('moneyAdded') || 'Money added!'); 
      setFullScreenAction(null); // সফল হলে স্ক্রিন বন্ধ হবে
    } else { 
      notifyError(result.error); 
    }
  };

  const handleWithdrawRequest = async (data) => {
    setProcessing(true);
    const { error } = await supabase.from('transactions').insert({
      user_id: (await supabase.auth.getUser()).data.user.id,
      type: 'withdrawal',
      amount: -data.amount,
      method: data.method,
      reference: data.accountNumber,
      status: 'pending',
      balance_after: balance - data.amount
    });
    setProcessing(false);
    if (!error) { 
      notifySuccess(t('withdrawRequested') || 'Withdrawal request submitted for approval'); 
      await refresh(); 
      setFullScreenAction(null); // সফল হলে স্ক্রিন বন্ধ হবে
    } else { 
      notifyError(error.message); 
    }
  };

  return (
    <div className="min-h-screen px-4 py-6 bg-[#f3f4f6] dark:bg-gray-900 relative">
      <div className="max-w-3xl mx-auto space-y-5">
        
        {/* হেডার */}
        <button onClick={() => navigate(ROUTES.USER_DASHBOARD)} className="text-slate-700 dark:text-white/80 hover:text-purple-600 dark:hover:text-white text-sm inline-flex items-center gap-2 font-medium">
          <ArrowLeft className="w-4 h-4" /> {t('back') || 'Back'}
        </button>
        
        <h1 className="text-2xl font-black text-slate-800 dark:text-white mb-2">{t('myWallet') || 'Wallet'}</h1>

        {/* ওয়ালেট কার্ড (এখানেই বাটনগুলো আছে) */}
        <WalletCard 
          balance={balance} 
          ordersCount={ordersCount} 
          totalSpent={totalSpent} 
          onRecharge={() => setFullScreenAction('add')}
          onWithdraw={() => setFullScreenAction('withdraw')}
        />

        {/* ট্রানজেকশন লিস্ট */}
        <div className="gaming-card p-5 mt-6 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-2 mb-4">
            <History className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            <h3 className="text-sm font-bold text-gray-800 dark:text-white">{t('recentTransactions') || 'Recent Transactions'}</h3>
          </div>
          <TransactionList transactions={transactions} loading={loading} />
        </div>

      </div>

      {/* 🌟 ফুল-স্ক্রিন অ্যাকশন ওভারলে (Add Money / Withdraw) */}
      {fullScreenAction && (
        <div className="fixed inset-0 z-[100] bg-[#f3f4f6] dark:bg-gray-900 overflow-y-auto flex flex-col animate-slide-up">
          
          {/* টপ হেডার (ব্যাক বাটন) */}
          <div className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-10 px-4 py-3 flex items-center justify-between">
            <button 
              onClick={() => setFullScreenAction(null)} 
              className="flex items-center gap-1.5 text-slate-700 dark:text-white text-sm font-bold bg-gray-100 dark:bg-gray-700 px-3 py-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <h2 className="text-base font-bold text-gray-800 dark:text-white">
              {fullScreenAction === 'add' ? (t('addMoney') || 'Add Money') : (t('withdraw') || 'Withdraw Money')}
            </h2>
            <div className="w-16"></div> {/* সেন্টার করার জন্য স্পেসার */}
          </div>

          {/* মেইন কন্টেন্ট */}
          <div className="flex-1 p-4 pb-24 max-w-md w-full mx-auto">
            <div className="gaming-card p-5 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 mt-2">
              {fullScreenAction === 'add' ? (
                <AddMoney onAdd={handleAddMoney} loading={processing} />
              ) : (
                <WithdrawMoney balance={balance} onWithdrawRequest={handleWithdrawRequest} loading={processing} />
              )}
            </div>
          </div>

          {/* বটম ফিক্সড ক্লোজ বাটন */}
          <div className="fixed bottom-0 inset-x-0 p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
            <button 
              onClick={() => setFullScreenAction(null)} 
              className="w-full py-3 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600 transition flex items-center justify-center gap-2"
            >
              <X className="w-5 h-5" /> Close
            </button>
          </div>

        </div>
      )}
    </div>
  );
};

export default WalletPage;
