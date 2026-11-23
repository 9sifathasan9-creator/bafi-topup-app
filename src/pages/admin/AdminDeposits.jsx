import React, { useEffect, useState } from 'react';
import { CheckCircle, XCircle, Wallet, RefreshCw, Eye } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useNotifications } from '../../hooks/useNotifications';
import { supabase } from '../../supabaseClient';
import { formatBDT, formatDateTime } from '../../utils/formatters';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import TransactionDetails from '../../components/admin/TransactionDetails';

const AdminDeposits = () => {
  const { t } = useLanguage();
  const { notifySuccess, notifyError } = useNotifications();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTx, setSelectedTx] = useState(null);

  const fetchRequests = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('transactions').select('*').eq('type', 'deposit').eq('status', 'pending').order('created_at', { ascending: false });
    if (error) console.error(error);
    setRequests(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchRequests(); }, []);

  const handleApprove = async (tx) => {
    try {
      await supabase.from('transactions').update({ status: 'completed' }).eq('id', tx.id);
      const { data: wallet } = await supabase.from('wallets').select('balance').eq('user_id', tx.user_id).single();
      if (wallet) {
        const newBalance = Number(wallet.balance) + Number(tx.amount);
        await supabase.from('wallets').update({ balance: newBalance }).eq('user_id', tx.user_id);
      }
      notifySuccess('Deposit Approved!');
      setSelectedTx(null);
      fetchRequests();
    } catch (err) { notifyError('Approval Failed'); }
  };

  const handleReject = async (id) => {
    await supabase.from('transactions').update({ status: 'failed' }).eq('id', id);
    notifySuccess('Deposit Rejected');
    setSelectedTx(null);
    fetchRequests();
  };

  return (
    <div className="space-y-5">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2"><Wallet className="w-6 h-6" /> Deposit Requests</h1>
          <p className="text-white/70 text-sm">{requests.length} pending requests</p>
        </div>
        <button onClick={fetchRequests} className="p-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition"><RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} /></button>
      </div>

      {loading ? <div className="text-white text-center py-10">Loading...</div> : requests.length === 0 ? (
        <Card variant="gaming" padding="lg" className="text-center text-gray-400">No pending deposits.</Card>
      ) : (
        <div className="grid gap-3">
          {requests.map(tx => (
            <Card key={tx.id} variant="gaming" padding="md" className="flex flex-col md:flex-row justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-bold text-white">User: {tx.user_id.slice(0, 8)}...</p>
                  <Badge variant="warning" size="sm">Pending</Badge>
                </div>
                <p className="text-xs text-gray-400 mb-2">{formatDateTime(tx.created_at)}</p>
                <div className="bg-black/20 p-3 rounded-lg text-sm space-y-1 mb-3">
                  <p className="text-gray-300">Method: <strong className="text-white uppercase">{tx.method}</strong></p>
                  <p className="text-gray-300">Sender: <strong className="text-white font-mono">{tx.sender_number || 'N/A'}</strong></p>
                  <p className="text-gray-300">TrxID: <strong className="text-white font-mono">{tx.reference || 'N/A'}</strong></p>
                </div>
              </div>
              <div className="flex flex-col items-end justify-between">
                <p className="text-xl font-black text-green-400">{formatBDT(tx.amount)}</p>
                <div className="flex gap-2 mt-3 md:mt-0">
                  <Button variant="success" size="sm" leftIcon={CheckCircle} onClick={() => handleApprove(tx)}>Approve</Button>
                  <Button variant="danger" size="sm" leftIcon={XCircle} onClick={() => handleReject(tx.id)}>Reject</Button>
                  <Button variant="secondary" size="sm" leftIcon={Eye} onClick={() => setSelectedTx(tx)}>Details</Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal isOpen={!!selectedTx} onClose={() => setSelectedTx(null)} title="Deposit Details" size="md">
        {selectedTx && <TransactionDetails tx={selectedTx} type="transaction" />}
      </Modal>
    </div>
  );
};
export default AdminDeposits;
