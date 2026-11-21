import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, ChevronRight, ChevronLeft, Image as ImageIcon, Package, Box } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useNotifications } from '../../hooks/useNotifications';
import { supabase } from '../../supabaseClient';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Modal from '../../components/ui/Modal';

const AdminGames = () => {
  const { t } = useLanguage();
  const { notifySuccess, notifyError } = useNotifications();

  // ভিউ স্টেট (কোন লেভেলে আছি)
  const [view, setView] = useState('games'); // 'games' | 'categories' | 'packages'
  const [selectedGame, setSelectedGame] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);

  // ডাটা স্টেট
  const [games, setGames] = useState([]);
  const [categories, setCategories] = useState([]);
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  // মডাল স্টেট
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState('game'); // 'game' | 'category' | 'package'
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);

  // ফর্ম স্টেট
  const [gameForm, setGameForm] = useState({ name: '', icon: '🎮', category: 'action', image_url: '' });
  const [catForm, setCatForm] = useState({ name: '', icon: '💎', description: '' });
  const [pkgForm, setPkgForm] = useState({ name: '', amount: '', price: '', image_url: '' });

  // ডাটা লোড ফাংশন
  const fetchGames = async () => {
    setLoading(true);
    const { data } = await supabase.from('games').select('*').order('created_at', { ascending: false });
    setGames(data || []);
    setLoading(false);
  };

  const fetchCategories = async (gameId) => {
    setLoading(true);
    const { data } = await supabase.from('game_categories').select('*').eq('game_id', gameId);
    setCategories(data || []);
    setLoading(false);
  };

  const fetchPackages = async (catId) => {
    setLoading(true);
    const { data } = await supabase.from('game_packages').select('*').eq('category_id', catId);
    setPackages(data || []);
    setLoading(false);
  };

  useEffect(() => { if (view === 'games') fetchGames(); }, [view]);
  useEffect(() => { if (view === 'categories' && selectedGame) fetchCategories(selectedGame.id); }, [view, selectedGame]);
  useEffect(() => { if (view === 'packages' && selectedCategory) fetchPackages(selectedCategory.id); }, [view, selectedCategory]);

  // অ্যাকশন হ্যান্ডলার
  const handleOpenModal = (type, item = null) => {
    setModalType(type);
    setEditing(item);
    setModalOpen(true);
    
    if (type === 'game') setGameForm(item || { name: '', icon: '🎮', category: 'action', image_url: '' });
    if (type === 'category') setCatForm(item || { name: '', icon: '💎', description: '' });
    if (type === 'package') setPkgForm(item || { name: '', amount: '', price: '', image_url: '' });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (modalType === 'game') {
        const payload = { ...gameForm, price: 0 }; // ডামি প্রাইস
        if (editing) await supabase.from('games').update(payload).eq('id', editing.id);
        else await supabase.from('games').insert([payload]);
        fetchGames();
      } 
      else if (modalType === 'category') {
        if (editing) await supabase.from('game_categories').update(catForm).eq('id', editing.id);
        else await supabase.from('game_categories').insert([{ ...catForm, game_id: selectedGame.id }]);
        fetchCategories(selectedGame.id);
      } 
      else if (modalType === 'package') {
        const payload = { ...pkgForm, price: Number(pkgForm.price) };
        if (editing) await supabase.from('game_packages').update(payload).eq('id', editing.id);
        else await supabase.from('game_packages').insert([{ ...payload, category_id: selectedCategory.id }]);
        fetchPackages(selectedCategory.id);
      }
      notifySuccess('Saved successfully!');
      setModalOpen(false);
    } catch (err) {
      notifyError('Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (type, id) => {
    if (!window.confirm('Are you sure you want to delete this?')) return;
    if (type === 'game') { await supabase.from('games').delete().eq('id', id); fetchGames(); }
    if (type === 'category') { await supabase.from('game_categories').delete().eq('id', id); fetchCategories(selectedGame.id); }
    if (type === 'package') { await supabase.from('game_packages').delete().eq('id', id); fetchPackages(selectedCategory.id); }
    notifySuccess('Deleted');
  };

  // UI রেন্ডার
  return (
    <div className="space-y-4">
      {/* হেডার ও ব্রেডক্রাম্ব */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Manage Games</h1>
          <div className="flex items-center gap-1 text-xs text-white/70 mt-1">
            <span className="cursor-pointer hover:text-white" onClick={() => setView('games')}>Games</span>
            {selectedGame && <><ChevronRight className="w-3 h-3" /><span className="cursor-pointer hover:text-white" onClick={() => setView('categories')}>{selectedGame.name}</span></>}
            {selectedCategory && <><ChevronRight className="w-3 h-3" /><span>{selectedCategory.name}</span></>}
          </div>
        </div>
        <Button variant="primary" size="sm" leftIcon={Plus} onClick={() => handleOpenModal(view === 'games' ? 'game' : view === 'categories' ? 'category' : 'package')}>
          Add {view === 'games' ? 'Game' : view === 'categories' ? 'Category' : 'Package'}
        </Button>
      </div>

      {/* গেম লিস্ট */}
      {view === 'games' && (
        <div className="space-y-2">
          {loading ? <p className="text-white text-center">Loading...</p> : games.map((game) => (
            <Card key={game.id} variant="gaming" padding="sm" className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{game.icon}</span>
                <p className="font-bold text-white text-sm">{game.name}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleOpenModal('game', game)} className="p-1.5 text-blue-400 bg-blue-900/20 rounded"><Edit className="w-4 h-4" /></button>
                <button onClick={() => handleDelete('game', game.id)} className="p-1.5 text-red-400 bg-red-900/20 rounded"><Trash2 className="w-4 h-4" /></button>
                <button onClick={() => { setSelectedGame(game); setView('categories'); }} className="px-3 py-1.5 bg-purple-600 text-white text-xs font-bold rounded">Categories</button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* ক্যাটাগরি লিস্ট */}
      {view === 'categories' && (
        <div className="space-y-2">
          <button onClick={() => { setView('games'); setSelectedGame(null); }} className="text-white text-sm flex items-center gap-1 mb-2"><ChevronLeft className="w-4 h-4" /> Back to Games</button>
          {loading ? <p className="text-white text-center">Loading...</p> : categories.map((cat) => (
            <Card key={cat.id} variant="gaming" padding="sm" className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{cat.icon}</span>
                <p className="font-bold text-white text-sm">{cat.name}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleOpenModal('category', cat)} className="p-1.5 text-blue-400 bg-blue-900/20 rounded"><Edit className="w-4 h-4" /></button>
                <button onClick={() => handleDelete('category', cat.id)} className="p-1.5 text-red-400 bg-red-900/20 rounded"><Trash2 className="w-4 h-4" /></button>
                <button onClick={() => { setSelectedCategory(cat); setView('packages'); }} className="px-3 py-1.5 bg-purple-600 text-white text-xs font-bold rounded">Packages</button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* প্যাকেজ লিস্ট */}
      {view === 'packages' && (
        <div className="space-y-2">
          <button onClick={() => { setView('categories'); setSelectedCategory(null); }} className="text-white text-sm flex items-center gap-1 mb-2"><ChevronLeft className="w-4 h-4" /> Back to Categories</button>
          {loading ? <p className="text-white text-center">Loading...</p> : packages.map((pkg) => (
            <Card key={pkg.id} variant="gaming" padding="sm" className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {pkg.image_url ? <img src={pkg.image_url} className="w-8 h-8 rounded object-cover" /> : <Box className="w-6 h-6 text-gray-400" />}
                <div>
                  <p className="font-bold text-white text-sm">{pkg.name} ({pkg.amount})</p>
                  <p className="text-xs text-purple-400 font-bold">৳{pkg.price}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleOpenModal('package', pkg)} className="p-1.5 text-blue-400 bg-blue-900/20 rounded"><Edit className="w-4 h-4" /></button>
                <button onClick={() => handleDelete('package', pkg.id)} className="p-1.5 text-red-400 bg-red-900/20 rounded"><Trash2 className="w-4 h-4" /></button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* মডাল (ফর্ম) */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={`${editing ? 'Edit' : 'Add'} ${modalType}`}>
        <div className="space-y-4">
          {modalType === 'game' && (
            <>
              <Input label="Game Name" value={gameForm.name} onChange={(e) => setGameForm({ ...gameForm, name: e.target.value })} />
              <Input label="Icon (Emoji)" value={gameForm.icon} onChange={(e) => setGameForm({ ...gameForm, icon: e.target.value })} />
              <Input label="Image URL" value={gameForm.image_url} onChange={(e) => setGameForm({ ...gameForm, image_url: e.target.value })} />
            </>
          )}
          {modalType === 'category' && (
            <>
              <Input label="Category Name" value={catForm.name} onChange={(e) => setCatForm({ ...catForm, name: e.target.value })} />
              <Input label="Icon (Emoji)" value={catForm.icon} onChange={(e) => setCatForm({ ...catForm, icon: e.target.value })} />
              <Input label="Description" value={catForm.description} onChange={(e) => setCatForm({ ...catForm, description: e.target.value })} />
            </>
          )}
          {modalType === 'package' && (
            <>
              <Input label="Package Name (e.g. 100 Diamonds)" value={pkgForm.name} onChange={(e) => setPkgForm({ ...pkgForm, name: e.target.value })} />
              <Input label="Amount (e.g. 100)" value={pkgForm.amount} onChange={(e) => setPkgForm({ ...pkgForm, amount: e.target.value })} />
              <Input label="Price (BDT)" type="number" value={pkgForm.price} onChange={(e) => setPkgForm({ ...pkgForm, price: e.target.value })} />
              <Input label="Image URL (Optional)" value={pkgForm.image_url} onChange={(e) => setPkgForm({ ...pkgForm, image_url: e.target.value })} />
            </>
          )}
          <div className="flex gap-3 mt-4">
            <Button variant="secondary" onClick={() => setModalOpen(false)} fullWidth>Cancel</Button>
            <Button variant="primary" onClick={handleSave} loading={saving} fullWidth>Save</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AdminGames;
