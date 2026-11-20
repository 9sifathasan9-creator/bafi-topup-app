import React, { useEffect, useState } from 'react';
import { CheckCircle, XCircle, Send } from 'lucide-react';
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
    const { data, error } = await supabase.from('transactions')
      .select(`*, profiles(email, full_name)`)
      .eq('type', 'withdrawal')
      .eq('status', 'pending')
      .order('created_at', { ascending: false });

    if (error) console.error(error);
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
        const newBalance = Number(wallet.balance) - Math.abs(Number(tx.amount));
        await supabase.from('wallets').update({ balance: newBalance }).eq('user_id', tx.user_id);
      }
      
      notifySuccess('Withdrawal Approved & Balance Deducted!');
      fetchRequests();
    } catch (err) { 
      console.error(err);
      notifyError('Approval Failed'); 
    }
  };

  const handleReject = async (id) => {
    await supabase.from('transactions').update({ status: 'failed' }).eq('id', id);
    notifySuccess('Withdrawal Rejected');
    fetchRequests();
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Send className="w-6 h-6" /> Withdrawal Requests
        </h1>
        <p className="text-white/70 text-sm">{requests.length} pending requests</p>
      </div>

      {loading ? (
        <div className="text-white text-center py-10">Loading...</div>
      ) : requests.length === 0 ? (
        <Card variant="gaming" padding="lg" className="text-center text-gray-400">
          No pending withdrawals.
        </Card>
      ) : (
        <div className="grid gap-3">
          {requests.map(tx => (
            <Card key={tx.id} variant="gaming" padding="md" className="flex flex-col md:flex-row justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-bold text-white">{tx.profiles?.email || 'User'}</p>
                  <Badge variant="warning" size="sm">Pending</Badge>
                </div>
                <p className="text-xs text-gray-400 mb-2">{formatDateTime(tx.created_at)}</p>
                
                <div className="bg-black/20 p-3 rounded-lg text-sm space-y-1 mb-3">
                  <p className="text-gray-300">Method: <strong className="text-white uppercase">{tx.method}</strong></p>
                  <p className="text-gray-300">Account: <strong className="text-white font-mono">{tx.reference}</strong></p>
                  <p className="text-gray-300">Amount: <strong className="text-red-400 font-bold">{formatBDT(Math.abs(tx.amount))}</strong></p>
                </div>
              </div>
              
              <div className="flex flex-col items-end justify-between">
                <div className="flex gap-2 mt-3 md:mt-0">
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
