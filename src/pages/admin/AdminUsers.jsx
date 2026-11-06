import React, { useEffect, useState } from 'react';
import { Users } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useNotifications } from '../../hooks/useNotifications';
import { supabase } from '../../supabaseClient';
import UserTable from '../../components/admin/UserTable';

const AdminUsers = () => {
  const { t } = useLanguage();
  const { notifySuccess } = useNotifications();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    setLoading(true);
    const { data } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
    setUsers(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleEdit = (user) => {
    console.log('Edit user:', user);
  };

  const handleDelete = async (id) => {
    if (!window.confirm(t('confirmDelete') || 'Delete this user?')) return;
    const { error } = await supabase.from('profiles').delete().eq('id', id);
    if (error) {
      console.error(error);
    } else {
      notifySuccess(t('userDeleted') || 'User deleted');
      fetchUsers();
    }
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Users className="w-6 h-6" /> {t('manageUsers') || 'Manage Users'}
        </h1>
        <p className="text-white/70 text-sm">{users.length} {t('users') || 'users'}</p>
      </div>

      {loading ? (
        <div className="gaming-card p-8 text-center text-gray-500">{t('loading') || 'Loading...'}</div>
      ) : (
        <UserTable users={users} onEdit={handleEdit} onDelete={handleDelete} />
      )}
    </div>
  );
};

export default AdminUsers;
