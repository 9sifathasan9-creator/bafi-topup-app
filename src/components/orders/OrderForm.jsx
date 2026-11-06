import React, { useState } from 'react';
import { ShoppingCart, User, Hash } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useNotifications } from '../../hooks/useNotifications';
import { formatBDT } from '../../utils/formatters';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Input from '../ui/Input';

const OrderForm = ({ game, onSubmit, loading = false }) => {
  const { t } = useLanguage();
  const { notifyError } = useNotifications();

  const [playerId, setPlayerId] = useState('');
  const [serverId, setServerId] = useState('');
  const [quantity, setQuantity] = useState(1);

  if (!game) return null;

  const total = (game.price || 0) * quantity;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!playerId.trim()) {
      notifyError(t('playerIdRequired') || 'Player ID required');
      return;
    }
    onSubmit?.({ playerId: playerId.trim(), serverId: serverId.trim(), quantity, amount: total });
  };

  return (
    <Card variant="gaming" padding="md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label={t('playerId') || 'Player ID'}
          leftIcon={User}
          value={playerId}
          onChange={(e) => setPlayerId(e.target.value)}
          placeholder={t('enterPlayerId') || 'Enter Player ID'}
          required
        />
        <Input
          label={`${t('serverId') || 'Server ID'} (${t('optional') || 'optional'})`}
          leftIcon={Hash}
          value={serverId}
          onChange={(e) => setServerId(e.target.value)}
          placeholder={t('enterServerId') || 'Enter Server ID'}
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('quantity') || 'Quantity'}
          </label>
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => setQuantity((q) => Math.max(1, q - 1))} className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-bold hover:bg-gray-200 transition">−</button>
            <span className="w-16 h-10 flex items-center justify-center bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg font-bold text-gray-800 dark:text-white">{quantity}</span>
            <button type="button" onClick={() => setQuantity((q) => q + 1)} className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-bold hover:bg-gray-200 transition">+</button>
          </div>
        </div>

        <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700 dark:text-gray-300">{t('total') || 'Total'}:</span>
            <span className="text-lg font-bold text-purple-600 dark:text-purple-400">{formatBDT(total)}</span>
          </div>
        </div>

        <Button type="submit" variant="primary" leftIcon={ShoppingCart} loading={loading} fullWidth>
          {t('placeOrder') || 'Place Order'}
        </Button>
      </form>
    </Card>
  );
};

export default OrderForm;
