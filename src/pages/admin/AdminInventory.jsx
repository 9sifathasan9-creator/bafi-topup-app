import React, { useEffect, useState } from 'react';
import { Package, AlertTriangle, Plus } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useGames } from '../../hooks/useGames';
import { useNotifications } from '../../hooks/useNotifications';
import { updateGame } from '../../supabaseClient';
import { formatBDT } from '../../utils/formatters';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

const AdminInventory = () => {
  const { t } = useLanguage();
  const { games, loading, refresh } = useGames();
  const { notifySuccess, notifyError } = useNotifications();
  const [editing, setEditing] = useState(null);
  const [newStock, setNewStock] = useState('');

  const handleUpdateStock = async () => {
    if (!editing || !newStock) return;
    try {
      await updateGame(editing.id, { stock: Number(newStock) });
      notifySuccess(t('stockUpdated') || 'Stock updated');
      setEditing(null);
      setNewStock('');
      refresh();
    } catch (err) {
      notifyError(t('updateFailed') || 'Update failed');
    }
  };

  const lowStockGames = games.filter((g) => g.stock !== undefined && g.stock <= 5 && g.stock > 0);
  const outOfStockGames = games.filter((g) => g.stock !== undefined && g.stock <= 0);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Package className="w-6 h-6" /> {t('inventory') || 'Inventory'}
        </h1>
        <p className="text-white/70 text-sm">{t('manageStock') || 'Manage game stock'}</p>
      </div>

      {(lowStockGames.length > 0 || outOfStockGames.length > 0) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Card variant="gaming" padding="md" className="border-l-4 border-red-500">
            <div className="flex items-center gap-2 mb-1">
              <AlertTriangle className="w-4 h-4 text-red-500" />
              <p className="text-sm font-semibold text-red-700 dark:text-red-300">{t('outOfStock') || 'Out of Stock'}</p>
            </div>
            <p className="text-2xl font-bold text-gray-800 dark:text-white">{outOfStockGames.length}</p>
          </Card>
          <Card variant="gaming" padding="md" className="border-l-4 border-yellow-500">
            <div className="flex items-center gap-2 mb-1">
              <AlertTriangle className="w-4 h-4 text-yellow-500" />
              <p className="text-sm font-semibold text-yellow-700 dark:text-yellow-300">{t('lowStock') || 'Low Stock'}</p>
            </div>
            <p className="text-2xl font-bold text-gray-800 dark:text-white">{lowStockGames.length}</p>
          </Card>
        </div>
      )}

      {loading ? (
        <div className="gaming-card p-8 text-center text-gray-500">{t('loading') || 'Loading...'}</div>
      ) : (
        <div className="gaming-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">{t('game') || 'Game'}</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">{t('price') || 'Price'}</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">{t('stock') || 'Stock'}</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">{t('action') || 'Action'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {games.map((game) => {
                  const stock = game.stock ?? 0;
                  const stockVariant = stock <= 0 ? 'danger' : stock <= 5 ? 'warning' : 'success';
                  return (
                    <tr key={game.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{game.icon || '🎮'}</span>
                          <span className="text-sm font-medium text-gray-800 dark:text-white">{game.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm font-bold text-purple-600 dark:text-purple-400">{formatBDT(game.price)}</td>
                      <td className="px-4 py-3">
                        <Badge variant={stockVariant} size="sm">{stock}</Badge>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => { setEditing(game); setNewStock(String(stock)); }}
                          className="text-xs px-3 py-1.5 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-lg hover:bg-purple-600 hover:text-white transition font-medium"
                        >
                          {t('update') || 'Update'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {editing && (
        <Card variant="gaming" padding="md">
          <h3 className="text-sm font-bold text-gray-800 dark:text-white mb-3">
            {t('updateStock') || 'Update Stock'}: {editing.name}
          </h3>
          <div className="flex gap-3">
            <Input type="number" value={newStock} onChange={(e) => setNewStock(e.target.value)} placeholder="0" min="0" />
            <Button variant="primary" onClick={handleUpdateStock}>{t('save') || 'Save'}</Button>
            <Button variant="secondary" onClick={() => setEditing(null)}>{t('cancel') || 'Cancel'}</Button>
          </div>
        </Card>
      )}
    </div>
  );
};

export default AdminInventory;
