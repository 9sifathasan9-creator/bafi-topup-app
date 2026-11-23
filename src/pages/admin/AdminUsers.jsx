import React, { useEffect, useState } from 'react';
import { Users, DollarSign, RefreshCw } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useNotifications } from '../../hooks/useNotifications';
import { supabase } from '../../supabaseClient';
import { formatBDT } from '../../utils/formatters';
import UserTable from '../../components/admin/UserTable';
import UserDetailsModal from '../../components/admin/UserDetailsModal';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

const AdminUsers = () => {
  const { t } = useLanguage();
  const { notifySuccess, notifyError } = useNotifications();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  // Details Modal State
  const [selectedUserDetails, setSelectedUserDetails] = useState(null);
  // Edit Wallet State
  const [selectedUserEdit, setSelectedUserEdit] = useState(null);
  
  const [amount, setAmount] = useState('');
  const [actionType, setActionType] = useState('add');
  const [processing, setProcessing] = useState(false);

  const fetchUsers = async (isManual = false) => {
    if (isManual) setRefreshing(true);
    else setLoading(true);

    try {
      const { data: profiles, error: pError } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
      if (pError) throw pError;

      const { data: wallets, error: wError } = await supabase.from('wallets').select('*');
      
      const merged = profiles.map(p => {
        const wallet = wallets?.find(w => w.user_id === p.id);
        return { ...p, balance: wallet ? Number(wallet.balance) : 0 };
      });

      setUsers(merged);
    } catch (err) {
      console.error("Fetch Users Error:", err);
      notifyError('Failed to load users');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleUpdateBalance = async () => {
    if (!amount || Number(amount) <= 0) return;
    setProcessing(true);

    try {
      const currentBalance = selectedUserEdit.balance || 0;
      const newBalance = actionType === 'add' 
        ? currentBalance + Number(amount) 
        : Math.max(0, currentBalance - Number(amount));

      const { error: walletError } = await supabase
        .from('wallets')
        .upsert({ user_id: selectedUserEdit.id, balance: newBalance }, { onConflict: 'user_id' });
        
      if (walletError) throw walletError;

      await supabase.from('transactions').insert({
        user_id: selectedUserEdit.id,
        type: actionType === 'add' ? 'bonus' : 'withdrawal',
        amount: actionType === 'add' ? Number(amount) : -Number(amount),
        reference: 'Admin Adjustment',
        status: 'completed',
        balance_after: newBalance,
      });

      notifySuccess(`✅ Balance updated for ${selectedUserEdit.email}`);
      setSelectedUserEdit(null);
      setAmount('');
      fetchUsers(true);
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
          <h1 className="text-2xl font-bold text-white flex items-center gap-2"><Users className="w-6 h-6" /> {t('manageUsers') || 'Manage Users'}</h1>
          <p className="text-white/70 text-sm">{users.length} users</p>
        </div>
        <button onClick={() => fetchUsers(true)} className="flex items-center gap-2 px-3 py-1.5 bg-white/10 text-white rounded-lg text-sm hover:bg-white/20 transition">
          <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} /> Refresh
        </button>
      </div>

      {loading ? <div className="gaming-card p-8 text-center text-gray-500">Loading...</div> : (
        <UserTable 
          users={users} 
          onViewDetails={(user) => setSelectedUserDetails(user)}
        />
      )}

      {/* User Details Modal */}
      <UserDetailsModal 
        isOpen={!!selectedUserDetails} 
        onClose={() => setSelectedUserDetails(null)} 
        user={selectedUserDetails} 
      />

      {/* Edit Wallet Modal */}
      <Modal isOpen={!!selectedUserEdit} onClose={() => setSelectedUserEdit(null)} title="Adjust Balance">
        {selectedUserEdit && (
          <div className="space-y-4">
            <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p className="text-xs text-gray-500 dark:text-gray-400">User</p>
              <p className="text-sm font-bold text-gray-800 dark:text-white">{selectedUserEdit.email}</p>
              <p className="text-xs text-purple-600 dark:text-purple-400 mt-1 font-bold">Current: {formatBDT(selectedUserEdit.balance)}</p>
            </div>

            <div className="flex gap-2">
              <button onClick={() => setActionType('add')} className={`flex-1 py-2 text-sm font-bold rounded-lg transition ${actionType === 'add' ? 'bg-green-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'}`}>+ Add</button>
              <button onClick={() => setActionType('subtract')} className={`flex-1 py-2 text-sm font-bold rounded-lg transition ${actionType === 'subtract' ? 'bg-red-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'}`}>- Deduct</button>
            </div>

            <Input label="Amount (BDT)" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="e.g. 500" leftIcon={DollarSign} />

            <Button onClick={handleUpdateBalance} loading={processing} disabled={!amount || Number(amount) <= 0} fullWidth>Confirm</Button>
          </div>
        )}
      </Modal>
    </div>
  );
};
export default AdminUsers;
