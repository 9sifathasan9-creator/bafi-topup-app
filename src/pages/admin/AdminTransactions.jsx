import React, { useEffect, useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { supabase } from '../../supabaseClient';
import TransactionTable from '../../components/admin/TransactionTable';
import ExportButton from '../../components/admin/ExportButton';

const AdminTransactions = () => {
  const { t } = useLanguage();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase.from('transactions').select('*').order('created_at', { ascending: false }).limit(100);
      setTransactions(data || []);
      setLoading(false);
    };
    fetch();
  }, []);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">{t('transactions') || 'Transactions'}</h1>
          <p className="text-white/70 text-sm">{transactions.length} {t('entries') || 'entries'}</p>
        </div>
        <ExportButton data={transactions} filename="transactions" />
      </div>

      {loading ? (
        <div className="gaming-card p-8 text-center text-gray-500">{t('loading') || 'Loading...'}</div>
      ) : (
        <TransactionTable transactions={transactions} />
      )}
    </div>
  );
};

export default AdminTransactions;
