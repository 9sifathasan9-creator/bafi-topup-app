import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Send, History } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useWallet } from '../../hooks/useWallet';
import { useOrders } from '../../hooks/useOrders';
import { useNotifications } from '../../hooks/useNotifications';
import { ROUTES } from '../../utils/constants';
import { supabase } from '../../supabaseClient';
import Tabs, { TabPanel } from '../../components/ui/Tabs';
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
  const [activeTab, setActiveTab] = useState('history');
  const [processing, setProcessing] = useState(false);

  const ordersCount = orders?.length || 0;
  const totalSpent = transactions.filter((tx) => tx.type === 'purchase' || Number(tx.amount) < 0).reduce((sum, tx) => sum + Math.abs(Number(tx.amount || 0)), 0);

  const handleAddMoney = async (data) => {
    setProcessing(true);
    const result = await addMoney(data.amount, data.method);
    setProcessing(false);
    if (result.success) { notifySuccess('Money added!'); setActiveTab('history'); } else { notifyError(result.error); }
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
    if (!error) { notifySuccess('Withdrawal request submitted for approval'); await refresh(); setActiveTab('history'); } else { notifyError(error.message); }
  };

  const tabs = [
    { id: 'history', label: 'History', icon: History },
    { id: 'add', label: 'Add', icon: Plus },
    { id: 'withdraw', label: 'Withdraw', icon: Send },
  ];

  return (
    <div className="min-h-screen px-4 py-6">
      <div className="max-w-3xl mx-auto space-y-5">
        <button onClick={() => navigate(ROUTES.USER_DASHBOARD)} className="text-slate-700 dark:text-white/80 hover:text-purple-600 dark:hover:text-white text-sm inline-flex items-center gap-2 font-medium"><ArrowLeft className="w-4 h-4" /> Back</button>
        <h1 className="text-2xl font-black text-slate-800 dark:text-white mb-2">Wallet</h1>
        <WalletCard balance={balance} ordersCount={ordersCount} totalSpent={totalSpent} onRecharge={() => setActiveTab('add')} />
        <div className="gaming-card p-5 mt-6 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800">
          <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} variant="pills" fullWidth className="mb-5" />
          <TabPanel id="history" activeTab={activeTab}><TransactionList transactions={transactions} loading={loading} /></TabPanel>
          <TabPanel id="add" activeTab={activeTab}><AddMoney onAdd={handleAddMoney} loading={processing} /></TabPanel>
          <TabPanel id="withdraw" activeTab={activeTab}><WithdrawMoney balance={balance} onWithdrawRequest={handleWithdrawRequest} loading={processing} /></TabPanel>
        </div>
      </div>
    </div>
  );
};
export default WalletPage;
