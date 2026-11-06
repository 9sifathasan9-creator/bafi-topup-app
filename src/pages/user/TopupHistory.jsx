import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useWallet } from '../../hooks/useWallet';
import { ROUTES } from '../../utils/constants';
import TransactionList from '../../components/wallet/TransactionList';
import Button from '../../components/ui/Button';

const TopupHistory = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { transactions, loading } = useWallet();

  const deposits = transactions.filter((tx) => tx.type === 'deposit');

  return (
    <div className="min-h-screen px-4 py-6">
      <div className="max-w-3xl mx-auto space-y-5">
        <button onClick={() => navigate(ROUTES.USER_DASHBOARD)} className="text-white/80 hover:text-white text-sm inline-flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> {t('back') || 'Back'}
        </button>

        <div className="gaming-card p-5">
          <h1 className="text-xl font-bold text-gray-800 dark:text-white mb-5">
            {t('topupHistory') || 'Top-up History'}
          </h1>
          <TransactionList transactions={deposits} loading={loading} />
        </div>

        <div className="text-center">
          <Button variant="primary" onClick={() => navigate(ROUTES.WALLET)}>
            {t('addMoney') || 'Add Money'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TopupHistory;
