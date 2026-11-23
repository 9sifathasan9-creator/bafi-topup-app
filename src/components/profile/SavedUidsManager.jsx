import React, { useState, useEffect } from 'react';
import { Plus, Copy, Trash2, Shield } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../hooks/useAuth';
import { supabase, doCopy } from '../../supabaseClient';
import Card from '../ui/Card';
import Input from '../ui/Input';
import Button from '../ui/Button';

const SavedUidsManager = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [uids, setUids] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState('');
  const [newUid, setNewUid] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchUids = async () => {
    if (!user?.id) return;
    setLoading(true);
    const { data, error } = await supabase.from('saved_uids').select('*').eq('user_id', user.id).order('created_at', { ascending: false });
    if (error) console.error(error);
    setUids(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchUids();
  }, [user]);

  const handleAdd = async () => {
    if (!newName.trim() || !newUid.trim()) return;
    const { error } = await supabase.from('saved_uids').insert({
      user_id: user.id,
      game_name: newName,
      player_uid: newUid
    });
    if (!error) {
      setNewName(''); setNewUid(''); setIsAdding(false);
      fetchUids();
    }
  };

  const handleDelete = async (id) => {
    await supabase.from('saved_uids').delete().eq('id', id);
    fetchUids();
  };

  return (
    <Card variant="gaming" padding="md" className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
            <Shield className="w-4 h-4 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-800 dark:text-white">Saved UIDs Manager</h3>
            <p className="text-[10px] text-gray-500">Save your game IDs</p>
          </div>
        </div>
        <button onClick={() => setIsAdding(!isAdding)} className="flex items-center gap-1 px-3 py-1.5 bg-purple-600 text-white text-xs font-bold rounded-lg hover:bg-purple-700 transition">
          <Plus className="w-3 h-3" /> Add UID
        </button>
      </div>

      {isAdding && (
        <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl space-y-3 border border-gray-200 dark:border-gray-700">
          <Input label="Game Name" placeholder="e.g. Free Fire" value={newName} onChange={(e) => setNewName(e.target.value)} />
          <Input label="Player UID" placeholder="e.g. 2154879032" value={newUid} onChange={(e) => setNewUid(e.target.value)} />
          <div className="flex gap-2">
            <Button variant="primary" size="sm" onClick={handleAdd} fullWidth>Save</Button>
            <Button variant="secondary" size="sm" onClick={() => setIsAdding(false)} fullWidth>Cancel</Button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {loading ? <p className="text-xs text-center text-gray-500 py-4">Loading...</p> : uids.length === 0 ? (
          <p className="text-xs text-center text-gray-500 py-4">No UIDs saved yet.</p>
        ) : (
          uids.map((uid) => (
            <div key={uid.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                  <span className="text-xs font-bold text-purple-600 dark:text-purple-400">{uid.game_name?.charAt(0).toUpperCase()}</span>
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-800 dark:text-white">{uid.game_name}</p>
                  <p className="text-[10px] text-gray-500 font-mono">{uid.player_uid}</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => doCopy(uid.player_uid)} className="p-1.5 text-gray-400 hover:text-blue-500 rounded-lg transition"><Copy className="w-3.5 h-3.5" /></button>
                <button onClick={() => handleDelete(uid.id)} className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg transition"><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
};
export default SavedUidsManager;
