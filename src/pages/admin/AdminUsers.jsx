import React, { useEffect, useState } from 'react';
import { Users, DollarSign } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useNotifications } from '../../hooks/useNotifications';
import { supabase } from '../../supabaseClient';
import { formatBDT } from '../../utils/formatters';
import UserTable from '../../components/admin/UserTable';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

const AdminUsers = () => {
  const { t } = useLanguage();
  const { notifySuccess, notifyError } = useNotifications();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [selectedUser, setSelectedUser] = useState(null);
  const [amount, setAmount] = useState('');
  const [actionType, setActionType] = useState('add');
  const [processing, setProcessing] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      // ১. প্রথমে সব প্রোফাইল আনা
      const { data: profiles, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (profileError) throw profileError;

      // ২. সব ওয়ালেট আনা
      const { data: wallets, error: walletError } = await supabase
        .from('wallets')
        .select('*');
        
      if (walletError) throw walletError;

      // ৩. প্রোফাইলের সাথে ওয়ালেটের ব্যালেন্স মিলিয়ে নেওয়া
      const mergedUsers = profiles.map(profile => {
        const userWallet = wallets.find(w => w.user_id === profile.id);
        return {
          ...profile,
          balance: userWallet ? Number(userWallet.balance) : 0
        };
      });

      setUsers(mergedUsers);
    } catch (err) {
      console.error("Fetch Users Error:", err);
      notifyError('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleUpdateBalance = async () => {
    if (!amount || Number(amount) <= 0) return;
    setProcessing(true);

    try {
      const currentBalance = selectedUser.balance || 0;
      const newBalance = actionType === 'add' 
        ? currentBalance + Number(amount) 
        : Math.max(0, currentBalance - Number(amount));

      // ওয়ালেট আপডেট (আগে থেকে থাকলে আপডেট, না থাকলে ইনসার্ট)
      const { error: walletError } = await supabase
        .from('wallets')
        .upsert({ user_id: selectedUser.id, balance: newBalance }, { onConflict: 'user_id' });
        
      if (walletError) throw walletError;

      // ট্রানজেকশন রেকর্ড
      await supabase.from('transactions').insert({
        user_id: selectedUser.id,
        type: actionType === 'add' ? 'bonus' : 'withdrawal',
        amount: actionType === 'add' ? Number(amount) : -Number(amount),
        reference: 'Admin Adjustment',
        status: 'completed',
        balance_after: newBalance,
      });

      notifySuccess(`✅ Balance updated for ${selectedUser.email}`);
      setSelectedUser(null);
      setAmount('');
      fetchUsers();
    } catch (err) {
      console.error(err);
      notifyError('Failed to update balance');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Users className="w-6 h-6" /> {t('manageUsers') || 'Manage Users'}
          </h1>
          <p className="text-white/70 text-sm">{users.length} users</p>
        </div>
        <button onClick={fetchUsers} className="px-3 py-1.5 bg-white/10 text-white rounded-lg text-sm">Refresh</button>
      </div>

      {loading ? (
        <div className="gaming-card p-8 text-center text-gray-500">Loading...</div>
      ) : (
        <UserTable 
          users={users} 
          onEditWallet={(user) => setSelectedUser(user)} 
        />
      )}

      <Modal isOpen={!!selectedUser} onClose={() => setSelectedUser(null)} title="Manage User Wallet">
        {selectedUser && (
          <div className="space-y-4">
            <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p className="text-xs text-gray-500 dark:text-gray-400">User</p>
              <p className="text-sm font-bold text-gray-800 dark:text-white">{selectedUser.email}</p>
              <p className="text-xs text-purple-600 dark:text-purple-400 mt-1 font-bold">
                Current Balance: {formatBDT(selectedUser.balance)}
              </p>
            </div>

            <div className="flex gap-2">
              <button onClick={() => setActionType('add')} className={`flex-1 py-2 text-sm font-bold rounded-lg transition ${actionType === 'add' ? 'bg-green-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'}`}>+ Add Money</button>
              <button onClick={() => setActionType('subtract')} className={`flex-1 py-2 text-sm font-bold rounded-lg transition ${actionType === 'subtract' ? 'bg-red-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'}`}>- Deduct</button>
            </div>

            <Input label="Amount (BDT)" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="e.g. 500" leftIcon={DollarSign} />

            <Button onClick={handleUpdateBalance} loading={processing} disabled={!amount || Number(amount) <= 0} fullWidth>
              Confirm {actionType === 'add' ? 'Addition' : 'Deduction'}
            </Button>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AdminUsers;
