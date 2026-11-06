import React from 'react';
import { Edit, Trash2, Shield } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { formatDate } from '../../utils/formatters';
import Card from '../ui/Card';
import Badge from '../ui/Badge';

const UserTable = ({ users = [], onEdit, onDelete }) => {
  const { t } = useLanguage();

  return (
    <Card variant="gaming" padding="none" className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">{t('user') || 'User'}</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">{t('role') || 'Role'}</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">{t('joined') || 'Joined'}</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">{t('actions') || 'Actions'}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-xs font-bold">
                        {(user.email || 'U').charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <span className="text-sm text-gray-800 dark:text-white truncate max-w-[200px]">{user.email}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <Badge variant={user.role === 'admin' ? 'warning' : 'gray'} size="sm">
                    {user.role === 'admin' && <Shield className="w-3 h-3" />}
                    {user.role || 'user'}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{formatDate(user.created_at)}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1">
                    {onEdit && (
                      <button onClick={() => onEdit(user)} className="p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition" aria-label="Edit">
                        <Edit className="w-4 h-4" />
                      </button>
                    )}
                    {onDelete && (
                      <button onClick={() => onDelete(user.id)} className="p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition" aria-label="Delete">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {users.length === 0 && (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400 text-sm">
            {t('noUsers') || 'No users found'}
          </div>
        )}
      </div>
    </Card>
  );
};

export default UserTable;
