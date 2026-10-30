import React, { useState } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useGames } from '../../hooks/useGames';
import { useNotifications } from '../../hooks/useNotifications';
import { isValidGameData } from '../../utils/validators';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Modal from '../../components/ui/Modal';
import GameTable from '../../components/admin/GameTable';

const AdminGames = () => {
  const { t } = useLanguage();
  const { games, loading, createGame, editGame, removeGame } = useGames();
  const { notifySuccess, notifyError } = useNotifications();

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', price: '', icon: '🎮', description: '', category: 'action' });
  const [saving, setSaving] = useState(false);

  const openAdd = () => {
    setEditing(null);
    setForm({ name: '', price: '', icon: '🎮', description: '', category: 'action' });
    setModalOpen(true);
  };

  const openEdit = (game) => {
    setEditing(game);
    setForm({
      name: game.name || '',
      price: game.price || '',
      icon: game.icon || '🎮',
      description: game.description || '',
      category: game.category || 'action',
    });
    setModalOpen(true);
  };

  const handleSave = async () => {
    const validation = isValidGameData(form);
    if (!validation.isValid) {
      notifyError(Object.values(validation.errors)[0]);
      return;
    }

    setSaving(true);
    try {
      if (editing) {
        await editGame(editing.id, { ...form, price: Number(form.price) });
        notifySuccess(t('gameUpdated') || 'Game updated!');
      } else {
        await createGame({ ...form, price: Number(form.price) });
        notifySuccess(t('gameAdded') || 'Game added!');
      }
      setModalOpen(false);
    } catch (err) {
      notifyError(t('saveFailed') || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(t('confirmDelete') || 'Delete this game?')) return;
    const result = await removeGame(id);
    if (result.success) notifySuccess(t('gameDeleted') || 'Game deleted');
    else notifyError(result.error);
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">{t('manageGames') || 'Manage Games'}</h1>
          <p className="text-white/70 text-sm">{games.length} {t('games') || 'games'}</p>
        </div>
        <Button variant="primary" leftIcon={Plus} onClick={openAdd}>
          {t('addGame') || 'Add Game'}
        </Button>
      </div>

      <GameTable games={games} onEdit={openEdit} onDelete={handleDelete} />

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? t('editGame') || 'Edit Game' : t('addGame') || 'Add Game'}>
        <div className="space-y-4">
          <Input label={t('gameName') || 'Game Name'} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <Input label={t('price') || 'Price'} type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
          <Input label={t('icon') || 'Icon (emoji)'} value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} />
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('category') || 'Category'}</label>
            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-800 dark:text-white outline-none focus:ring-2 focus:ring-purple-500">
              <option value="action">Action</option>
              <option value="battle-royale">Battle Royale</option>
              <option value="moba">MOBA</option>
              <option value="fps">FPS</option>
              <option value="rpg">RPG</option>
              <option value="strategy">Strategy</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('description') || 'Description'}</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="w-full px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-800 dark:text-white outline-none focus:ring-2 focus:ring-purple-500 resize-none" />
          </div>
          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => setModalOpen(false)} fullWidth>{t('cancel') || 'Cancel'}</Button>
            <Button variant="primary" onClick={handleSave} loading={saving} fullWidth>{t('save') || 'Save'}</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AdminGames;
