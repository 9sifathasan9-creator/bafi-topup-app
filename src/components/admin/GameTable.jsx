import React from 'react';
import { Edit, Trash2 } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { formatBDT } from '../../utils/formatters';
import Card from '../ui/Card';
import Badge from '../ui/Badge';

const GameTable = ({ games = [], onEdit, onDelete }) => {
  const { t } = useLanguage();

  return (
    <Card variant="gaming" padding="none" className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">{t('game') || 'Game'}</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">{t('category') || 'Category'}</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">{t('price') || 'Price'}</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">{t('actions') || 'Actions'}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {games.map((game) => (
              <tr key={game.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{game.icon || '🎮'}</span>
                    <span className="text-sm font-medium text-gray-800 dark:text-white truncate max-w-[200px]">{game.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <Badge variant="purple" size="sm">{game.category || 'general'}</Badge>
                </td>
                <td className="px-4 py-3 text-sm font-bold text-purple-600 dark:text-purple-400">{formatBDT(game.price)}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1">
                    {onEdit && (
                      <button onClick={() => onEdit(game)} className="p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition" aria-label="Edit">
                        <Edit className="w-4 h-4" />
                      </button>
                    )}
                    {onDelete && (
                      <button onClick={() => onDelete(game.id)} className="p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition" aria-label="Delete">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {games.length === 0 && (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400 text-sm">
            {t('noGames') || 'No games found'}
          </div>
        )}
      </div>
    </Card>
  );
};

export default GameTable;
