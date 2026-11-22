import React from 'react';
import { Edit, Trash2, Shield, Wallet } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { formatDate, formatBDT } from '../../utils/formatters';
import Card from '../ui/Card';
import Badge from '../ui/Badge';

const UserTable = ({ users = [], onEdit, onDelete, onEditWallet }) => {
  const { t } = useLanguage();

  return (
    <Card variant="gaming" padding="none" className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">User</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Balance</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">PIN</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Role</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {users.map((user) => {
              const balance = user.wallets?.[0]?.balance || 0;
              return (
                <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-xs font-bold">{(user.email || 'U').charAt(0).toUpperCase()}</span>
                      </div>
                      <span className="text-sm text-gray-800 dark:text-white truncate max-w-[150px]">{user.email}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm font-bold text-green-600 dark:text-green-400">
                    {formatBDT(balance)}
                  </td>
                  <td className="px-4 py-3 text-sm font-mono text-gray-800 dark:text-white">
                    {user.transaction_pin ? <span className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">{user.transaction_pin}</span> : <span className="text-red-400 text-xs italic">Not Set</span>}
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={user.role === 'admin' ? 'warning' : 'gray'} size="sm">
                      {user.role === 'admin' && <Shield className="w-3 h-3" />} {user.role || 'user'}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      {onEditWallet && (
                        <button onClick={() => onEditWallet(user)} className="p-1.5 text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg transition" title="Manage Balance">
                          <Wallet className="w-4 h-4" />
                        </button>
                      )}
                      {onDelete && <button onClick={() => onDelete(user.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition"><Trash2 className="w-4 h-4" /></button>}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default UserTable;
