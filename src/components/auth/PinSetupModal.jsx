import React, { useState } from 'react';
import { Lock, AlertCircle } from 'lucide-react';
import { supabase } from '../../supabaseClient';
import { useNotifications } from '../../hooks/useNotifications';
import Button from '../ui/Button';
import Modal from '../ui/Modal';

const PinSetupModal = ({ isOpen, user, onSuccess }) => {
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { notifySuccess } = useNotifications();

  const handleSave = async () => {
    if (pin.length !== 4 || !/^\d+$/.test(pin)) {
      setError('PIN must be exactly 4 digits.');
      return;
    }
    if (pin !== confirmPin) {
      setError('PINs do not match. Please try again.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ transaction_pin: pin })
        .eq('id', user.id);

      if (updateError) throw updateError;

      notifySuccess('Transaction PIN set successfully!');
      onSuccess();
    } catch (err) {
      console.error(err);
      setError('Failed to save PIN. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={() => {}} title="Security Setup Required" showCloseButton={false} size="sm">
      <div className="space-y-4 py-2">
        <div className="flex justify-center mb-2">
          <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
            <Lock className="w-8 h-8 text-purple-600 dark:text-purple-400" />
          </div>
        </div>
        
        <p className="text-sm text-center text-gray-700 dark:text-gray-300">
          Please set a 4-digit Transaction PIN for your account. This is required once.
        </p>

        <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded-lg border border-orange-200 dark:border-orange-800">
          <p className="text-[10px] text-orange-700 dark:text-orange-300 leading-relaxed">
            এটি আপনার বিকাশ, নগদ কিংবা অন্য কোন মোবাইল ব্যাংকিং এর পিন নয় এটি আপনার বাফি একাউন্টের পিন। টাকা ঢুকানো ব্যতীত অন্য সকল ট্রানজেকশনের পূর্বে আপনাকে এই পিন দিতে হবে। তাই এই পিনটি যত্ন সহকারে সংরক্ষণ করুন, ধন্যবাদ।
            <br/><br/>
            This is NOT your bKash, Nagad, or any mobile banking PIN. It is your BAFI account PIN. You must enter this PIN before all transactions EXCEPT adding money. Keep it safe, thank you.
          </p>
        </div>

        {error && (
          <div className="flex items-center gap-2 text-red-500 text-xs bg-red-50 dark:bg-red-900/20 p-2 rounded">
            <AlertCircle className="w-4 h-4 flex-shrink-0" /> {error}
          </div>
        )}

        <div>
          <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Enter 4-Digit PIN</label>
          <input 
            type="password" 
            maxLength={4} 
            value={pin} 
            onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))} 
            className="w-full text-center text-2xl tracking-[0.5em] font-bold py-3 bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-purple-500 outline-none" 
            placeholder="••••" 
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Confirm 4-Digit PIN</label>
          <input 
            type="password" 
            maxLength={4} 
            value={confirmPin} 
            onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, ''))} 
            className="w-full text-center text-2xl tracking-[0.5em] font-bold py-3 bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-purple-500 outline-none" 
            placeholder="••••" 
          />
        </div>

        <Button onClick={handleSave} loading={loading} fullWidth variant="primary">
          Save PIN & Continue
        </Button>
      </div>
    </Modal>
  );
};

export default PinSetupModal;
