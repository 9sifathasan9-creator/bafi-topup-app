import { createClient } from '@supabase/supabase-js';

// .env.local ফাইল থেকে URL এবং Key লোড হবে (হার্ডকোড করা নেই)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY; // অথবা VITE_SUPABASE_ANON_KEY
export const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL || '9sifathasan9@gmail.com';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ============================================
// 📋 doCopy Function
// ============================================
export const doCopy = (text) => {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text).catch(() => fallbackCopy(text));
  } else {
    fallbackCopy(text);
  }
};

function fallbackCopy(text) {
  const el = document.createElement('textarea');
  el.value = text;
  el.style.position = 'fixed';
  el.style.left = '-9999px';
  document.body.appendChild(el);
  el.select();
  try { document.execCommand('copy'); } catch (err) { console.error(err); }
  document.body.removeChild(el);
}

// --- বাকি ফাংশনগুলো (getGames, addGame ইত্যাদি) আগের মতোই থাকবে ---
export const getGames = async () => {
  const { data, error } = await supabase.from('games').select('*').order('created_at', { ascending: false });
  if (error) { console.error(error); return []; }
  return data || [];
};

export const getNotices = async () => {
  const { data, error } = await supabase.from('notices').select('*').order('created_at', { ascending: false });
  if (error) { console.error(error); return []; }
  return data || [];
};

export const addGame = async (game) => {
  const { data, error } = await supabase.from('games').insert([game]).select();
  if (error) { console.error(error); return null; }
  return data?.[0];
};

export const updateGame = async (id, updates) => {
  const { data, error } = await supabase.from('games').update(updates).eq('id', id).select();
  if (error) { console.error(error); return null; }
  return data?.[0];
};

export const deleteGame = async (id) => {
  const { error } = await supabase.from('games').delete().eq('id', id);
  if (error) { console.error(error); return false; }
  return true;
};
