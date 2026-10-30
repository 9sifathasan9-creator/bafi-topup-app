import React, { useEffect, useState } from 'react';
import { UserCog, Search } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useNotifications } from '../../hooks/useNotifications';
import { supabase } from '../../supabaseClient';
import Card from '../../components/ui/Card';
import RoleManager from '../../components/admin/RoleManager';

const AdminRoles = () => {
  const { t } = useLanguage();
  const { notifySuccess } = useNotifications();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);

  const fetchUsers = async () => {
    setLoading(true);
    const { data } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
    setUsers(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleRoleChange = async (userId, newRole) => {
    const { error } = await supabase.from('profiles').update({ role: newRole }).eq('id', userId);
    if (!error) {
      notifySuccess(t('roleUpdated') || 'Role updated');
      fetchUsers();
      setSelectedUser(null);
    }
  };

  const filtered = users.filter((u) => u.email?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <UserCog className="w-6 h-6" /> {t('roles') || 'Role Management'}
        </h1>
        <p className="text-white/70 text-sm">{t('manageRolesDesc') || 'Manage user roles and permissions'}</p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t('searchUsers') || 'Search users...'}
          className="w-full pl-10 pr-4 py-2.5 bg-white/10 backdrop-blur border border-white/20 rounded-lg text-sm text-white placeholder:text-white/50 outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div>
          {loading ? (
            <div className="gaming-card p-8 text-center text-gray-500">{t('loading') || 'Loading...'}</div>
          ) : (
            <Card variant="gaming" padding="md">
              <h3 className="text-sm font-bold text-gray-800 dark:text-white mb-3">
                {t('users') || 'Users'} ({filtered.length})
              </h3>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {filtered.map((u) => (
                  <button
                    key={u.id}
                    onClick={() => setSelectedUser(u)}
                    className={`w-full text-left p-3 rounded-lg transition ${
                      selectedUser?.id === u.id
                        ? 'bg-purple-100 dark:bg-purple-900/30 border border-purple-500'
                        : 'bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <p className="text-sm font-medium text-gray-800 dark:text-white truncate">{u.email}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 capitalize mt-0.5">
                      {t('role') || 'Role'}: {u.role || 'user'}
                    </p>
                  </button>
                ))}
              </div>
            </Card>
          )}
        </div>

        <div>
          {selectedUser ? (
            <RoleManager user={selectedUser} currentRole={selectedUser.role} onRoleChange={handleRoleChange} />
          ) : (
            <Card variant="gaming" padding="lg" className="text-center">
              <UserCog className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                {t('selectUserToManage') || 'Select a user to manage role'}
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminRoles;
