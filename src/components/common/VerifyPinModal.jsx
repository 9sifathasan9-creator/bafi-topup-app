import React, { useState } from 'react';
import { Lock } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { supabase } from '../../supabaseClient';
import Modal from '../ui/Modal';
import Button from '../ui/Button';

const VerifyPinModal = ({ isOpen, onClose, onSuccess, actionText = "Confirm Transaction" }) => {
  const { t } = useLanguage();
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleVerify = async () => {
    if (pin.length !== 4) { setError('PIN must be 4 digits'); return; }
    setLoading(true);
    setError('');

    try {
      const { data: { user } } = await supabase.auth.getUser();
      const { data: profile } = await supabase.from('profiles').select('transaction_pin').eq('id', user.id).single();

      if (!profile?.transaction_pin) {
        await supabase.from('profiles').update({ transaction_pin: '1234' }).eq('id', user.id);
        if (pin === '1234') { onSuccess(); } else { setError('Default PIN is 1234'); }
      } else if (profile.transaction_pin === pin) {
        onSuccess();
      } else {
        setError('Incorrect PIN. Try again.');
      }
    } catch (err) {
      setError('Verification failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Security Check" size="sm">
      <div className="text-center space-y-4 py-2">
        <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto">
          <Lock className="w-8 h-8 text-purple-600 dark:text-purple-400" />
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Enter your 4-digit Transaction PIN to <strong>{actionText}</strong>.<br/>
          <span className="text-xs text-purple-500">(Default PIN: 1234 if not set)</span>
        </p>
        <input
          type="password"
          maxLength={4}
          value={pin}
          onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
          className="w-full text-center text-3xl tracking-[1em] font-bold py-3 bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-purple-500 outline-none"
          placeholder="••••"
        />
        {error && <p className="text-xs text-red-500">{error}</p>}
        <Button onClick={handleVerify} loading={loading} disabled={pin.length !== 4} fullWidth>Verify PIN</Button>
      </div>
    </Modal>
  );
};
export default VerifyPinModal;
