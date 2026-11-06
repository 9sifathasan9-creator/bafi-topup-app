import React, { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, Ticket } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useNotifications } from '../../hooks/useNotifications';
import { getCoupons, addCoupon } from '../../supabaseClient';
import { supabase } from '../../supabaseClient';
import { formatBDT, formatDate } from '../../utils/formatters';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Modal from '../../components/ui/Modal';
import Badge from '../../components/ui/Badge';

const AdminCoupons = () => {
  const { t } = useLanguage();
  const { notifySuccess, notifyError } = useNotifications();
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    code: '', title: '', description: '',
    discount_type: 'percentage', discount_value: '',
    min_purchase: '', active: true,
  });

  const fetchCoupons = async () => {
    setLoading(true);
    const data = await getCoupons();
    setCoupons(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchCoupons(); }, []);

  const openAdd = () => {
    setEditing(null);
    setForm({ code: '', title: '', description: '', discount_type: 'percentage', discount_value: '', min_purchase: '', active: true });
    setModalOpen(true);
  };

  const openEdit = (coupon) => {
    setEditing(coupon);
    setForm({
      code: coupon.code || '', title: coupon.title || '',
      description: coupon.description || '',
      discount_type: coupon.discount_type || 'percentage',
      discount_value: coupon.discount_value || '',
      min_purchase: coupon.min_purchase || '',
      active: coupon.active !== false,
    });
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.code.trim() || !form.discount_value) {
      notifyError(t('fillRequired') || 'Fill required fields');
      return;
    }
    setSaving(true);
    try {
      const payload = {
        ...form,
        code: form.code.trim().toUpperCase(),
        discount_value: Number(form.discount_value),
        min_purchase: form.min_purchase ? Number(form.min_purchase) : null,
      };
      if (editing) {
        await supabase.from('coupons').update(payload).eq('id', editing.id);
        notifySuccess(t('couponUpdated') || 'Coupon updated');
      } else {
        await addCoupon(payload);
        notifySuccess(t('couponAdded') || 'Coupon added');
      }
      setModalOpen(false);
      fetchCoupons();
    } catch (err) {
      notifyError(t('saveFailed') || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(t('confirmDelete') || 'Delete?')) return;
    const { error } = await supabase.from('coupons').delete().eq('id', id);
    if (!error) {
      notifySuccess(t('couponDeleted') || 'Deleted');
      fetchCoupons();
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Ticket className="w-6 h-6" /> {t('coupons') || 'Coupons'}
          </h1>
          <p className="text-white/70 text-sm">{coupons.length} {t('total') || 'total'}</p>
        </div>
        <Button variant="primary" leftIcon={Plus} onClick={openAdd}>
          {t('addCoupon') || 'Add Coupon'}
        </Button>
      </div>

      {loading ? (
        <div className="gaming-card p-8 text-center text-gray-500">{t('loading') || 'Loading...'}</div>
      ) : coupons.length === 0 ? (
        <Card variant="gaming" padding="lg" className="text-center">
          <p className="text-gray-500 dark:text-gray-400">{t('noCoupons') || 'No coupons yet'}</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {coupons.map((coupon) => (
            <Card key={coupon.id} variant="gaming" padding="md">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-mono font-bold text-purple-600 dark:text-purple-400">{coupon.code}</p>
                    <Badge variant={coupon.active ? 'success' : 'gray'} size="sm">
                      {coupon.active ? t('active') || 'Active' : t('inactive') || 'Inactive'}
                    </Badge>
                  </div>
                  <p className="text-sm font-semibold text-gray-800 dark:text-white mb-1">{coupon.title}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">{coupon.description}</p>
                  <div className="flex flex-wrap gap-3 text-xs text-gray-500 dark:text-gray-400">
                    <span>
                      {coupon.discount_type === 'percentage'
                        ? `${coupon.discount_value}% OFF`
                        : `${formatBDT(coupon.discount_value)} OFF`}
                    </span>
                    {coupon.min_purchase && <span>Min: {formatBDT(coupon.min_purchase)}</span>}
                  </div>
                </div>
                <div className="flex gap-1 flex-shrink-0">
                  <button onClick={() => openEdit(coupon)} className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(coupon.id)} className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? t('editCoupon') || 'Edit Coupon' : t('addCoupon') || 'Add Coupon'}>
        <div className="space-y-4">
          <Input label={t('couponCode') || 'Code'} value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} placeholder="SAVE10" required />
          <Input label={t('title') || 'Title'} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <Input label={t('description') || 'Description'} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('type') || 'Type'}</label>
              <select value={form.discount_type} onChange={(e) => setForm({ ...form, discount_type: e.target.value })} className="w-full px-3 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-800 dark:text-white outline-none">
                <option value="percentage">Percentage (%)</option>
                <option value="fixed">Fixed (৳)</option>
              </select>
            </div>
            <Input label={t('value') || 'Value'} type="number" value={form.discount_value} onChange={(e) => setForm({ ...form, discount_value: e.target.value })} required />
          </div>
          <Input label={t('minPurchase') || 'Min Purchase'} type="number" value={form.min_purchase} onChange={(e) => setForm({ ...form, min_purchase: e.target.value })} />
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} className="w-4 h-4 accent-purple-600" />
            <span className="text-sm text-gray-700 dark:text-gray-300">{t('active') || 'Active'}</span>
          </label>
          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => setModalOpen(false)} fullWidth>{t('cancel') || 'Cancel'}</Button>
            <Button variant="primary" onClick={handleSave} loading={saving} fullWidth>{t('save') || 'Save'}</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AdminCoupons;
