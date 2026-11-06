import React, { useEffect, useState } from 'react';
import { Send, CheckCircle, XCircle } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useNotifications } from '../../hooks/useNotifications';
import { supabase } from '../../supabaseClient';
import { formatBDT, formatDateTime } from '../../utils/formatters';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';

const AdminWithdrawals = () => {
  const { t } = useLanguage();
  const { notifySuccess, notifyError } = useNotifications();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    setLoading(true);
    const { data } = await supabase.from('transactions')
      .select(`*, profiles(email, full_name)`)
      .eq('type', 'withdrawal').eq('status', 'pending')
      .order('created_at', { ascending: false });
    setRequests(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchRequests(); }, []);

  const handleApprove = async (tx) => {
    try {
      // ১. ট্রানজেকশন স্ট্যাটাস Completed করা
      await supabase.from('transactions').update({ status: 'completed' }).eq('id', tx.id);
      
      // ২. ইউজারের ওয়ালেট থেকে টাকা কাটা
      const { data: wallet } = await supabase.from('wallets').select('balance').eq('user_id', tx.user_id).single();
      if (wallet) {
        await supabase.from('wallets').update({ balance: wallet.balance - Math.abs(tx.amount) }).eq('user_id', tx.user_id);
      }
      notifySuccess('Withdrawal Approved & Balance Deducted');
      fetchRequests();
    } catch (err) { notifyError('Failed to approve'); }
  };

  const handleReject = async (id) => {
    await supabase.from('transactions').update({ status: 'failed' }).eq('id', id);
    notifySuccess('Withdrawal Rejected');
    fetchRequests();
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2"><Send className="w-6 h-6" /> Withdrawal Requests</h1>
        <p className="text-white/70 text-sm">{requests.length} pending requests</p>
      </div>

      {loading ? <div className="text-white text-center">Loading...</div> : requests.length === 0 ? (
        <Card variant="gaming" padding="lg" className="text-center text-gray-400">No pending withdrawals.</Card>
      ) : (
        <div className="grid gap-3">
          {requests.map(tx => (
            <Card key={tx.id} variant="gaming" padding="md" className="flex flex-col sm:flex-row justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-bold text-white">{tx.profiles?.email || 'User'}</p>
                  <Badge variant="warning" size="sm">Pending</Badge>
                </div>
                <p className="text-xs text-gray-400 mb-2">{formatDateTime(tx.created_at)}</p>
                <p className="text-sm text-gray-300">Method: <strong className="text-white uppercase">{tx.method}</strong> | Acc: <strong className="text-white">{tx.reference}</strong></p>
              </div>
              <div className="flex flex-col sm:items-end justify-between">
                <p className="text-xl font-bold text-purple-400 mb-2">{formatBDT(Math.abs(tx.amount))}</p>
                <div className="flex gap-2">
                  <Button variant="success" size="sm" leftIcon={CheckCircle} onClick={() => handleApprove(tx)}>Approve</Button>
                  <Button variant="danger" size="sm" leftIcon={XCircle} onClick={() => handleReject(tx.id)}>Reject</Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
export default AdminWithdrawals;
