import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Image as ImageIcon } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useNotifications } from '../../hooks/useNotifications';
import { getNotices, addNotice, updateNotice, deleteNotice } from '../../supabaseClient';
import { isValidNoticeData } from '../../utils/validators';
import { formatRelativeTime } from '../../utils/formatters';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Modal from '../../components/ui/Modal';

const AdminNotices = () => {
  const { t } = useLanguage();
  const { notifySuccess, notifyError } = useNotifications();
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ title: '', content: '', image_url: '' });
  const [saving, setSaving] = useState(false);

  const fetchNotices = async () => {
    setLoading(true);
    const data = await getNotices();
    setNotices(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchNotices(); }, []);

  const openAdd = () => {
    setEditing(null);
    setForm({ title: '', content: '', image_url: '' });
    setModalOpen(true);
  };

  const openEdit = (notice) => {
    setEditing(notice);
    setForm({ title: notice.title || '', content: notice.content || '', image_url: notice.image_url || '' });
    setModalOpen(true);
  };

  const handleSave = async () => {
    const validation = isValidNoticeData(form);
    if (!validation.isValid) {
      notifyError(Object.values(validation.errors)[0]);
      return;
    }
    setSaving(true);
    try {
      if (editing) {
        await updateNotice(editing.id, form);
        notifySuccess(t('noticeUpdatedMsg') || 'Notice updated!');
      } else {
        await addNotice(form);
        notifySuccess(t('noticeAdded') || 'Notice added!');
      }
      setModalOpen(false);
      fetchNotices();
    } catch (err) {
      notifyError(t('saveFailed') || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(t('confirmDelete') || 'Delete this notice?')) return;
    const success = await deleteNotice(id);
    if (success) {
      notifySuccess(t('noticeDeleted') || 'Notice deleted');
      fetchNotices();
    } else {
      notifyError(t('deleteFailed') || 'Delete failed');
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">{t('manageNotices') || 'Manage Notices'}</h1>
          <p className="text-white/70 text-xs">{notices.length} {t('notices') || 'notices'}</p>
        </div>
        <Button variant="primary" size="sm" leftIcon={Plus} onClick={openAdd}>
          {t('addNotice') || 'Add Notice'}
        </Button>
      </div>

      {loading ? (
        <Card variant="gaming" padding="lg" className="text-center text-white text-sm">Loading...</Card>
      ) : notices.length === 0 ? (
        <Card variant="gaming" padding="lg" className="text-center">
          <p className="text-gray-500 dark:text-gray-400 text-sm">No notices yet</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {notices.map((notice) => (
            <Card key={notice.id} variant="gaming" padding="md">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-sm text-gray-800 dark:text-white mb-1">{notice.title}</h3>
                  <p className="text-xs text-gray-600 dark:text-gray-300 mb-2 line-clamp-2">{notice.content}</p>
                  {notice.image_url && (
                    <div className="w-16 h-16 rounded-md overflow-hidden mb-2 bg-gray-100 flex-shrink-0">
                      <img src={notice.image_url} alt="notice" className="w-full h-full object-cover" />
                    </div>
                  )}
                  <p className="text-[10px] text-gray-500 dark:text-gray-400">{formatRelativeTime(notice.created_at)}</p>
                </div>
                <div className="flex gap-1 flex-shrink-0">
                  <button onClick={() => openEdit(notice)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition"><Edit className="w-3.5 h-3.5" /></button>
                  <button onClick={() => handleDelete(notice.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Notice' : 'Add Notice'} size="md">
        <div className="space-y-4">
          <Input label="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Content</label>
            <textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} rows={3} className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-800 dark:text-white outline-none focus:ring-2 focus:ring-purple-500 resize-none" />
          </div>
          <Input label="Image URL (Optional)" leftIcon={ImageIcon} value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} placeholder="https://example.com/image.jpg" />
          
          {form.image_url && (
            <div className="w-full h-32 rounded-lg overflow-hidden bg-gray-100">
              <img src={form.image_url} alt="Preview" className="w-full h-full object-contain" onError={(e) => e.target.style.display = 'none'} />
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <Button variant="secondary" size="sm" onClick={() => setModalOpen(false)} fullWidth>Cancel</Button>
            <Button variant="primary" size="sm" onClick={handleSave} loading={saving} fullWidth>Save</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AdminNotices;
