import React, { useEffect, useState } from 'react';
import { Database } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { supabase } from '../../supabaseClient';
import BackupRestore from '../../components/admin/BackupRestore';
import Card from '../../components/ui/Card';

const AdminBackup = () => {
  const { t } = useLanguage();
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [games, notices, profiles] = await Promise.all([
          supabase.from('games').select('*'),
          supabase.from('notices').select('*'),
          supabase.from('profiles').select('*'),
        ]);
        setData({
          games: games.data || [],
          notices: notices.data || [],
          profiles: profiles.data || [],
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleRestore = async (json) => {
    console.log('Restore data:', json);
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Database className="w-6 h-6" /> {t('backupRestore') || 'Backup & Restore'}
        </h1>
        <p className="text-white/70 text-sm">{t('backupDesc') || 'Create and restore data backups'}</p>
      </div>

      {loading ? (
        <div className="gaming-card p-8 text-center text-gray-500">{t('loading') || 'Loading...'}</div>
      ) : (
        <>
          <BackupRestore data={data} onRestore={handleRestore} />

          <Card variant="gaming" padding="md">
            <h3 className="text-sm font-bold text-gray-800 dark:text-white mb-3">
              {t('dataSummary') || 'Data Summary'}
            </h3>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{data.games?.length || 0}</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">{t('games') || 'Games'}</p>
              </div>
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{data.notices?.length || 0}</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">{t('notices') || 'Notices'}</p>
              </div>
              <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">{data.profiles?.length || 0}</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">{t('users') || 'Users'}</p>
              </div>
            </div>
          </Card>
        </>
      )}
    </div>
  );
};

export default AdminBackup;
