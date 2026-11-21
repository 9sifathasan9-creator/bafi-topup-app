import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import { supabase } from '../../supabaseClient';
import { useGames } from '../../hooks/useGames';
import StepIndicator from '../../components/common/StepIndicator';
import Card from '../../components/ui/Card';

const CategoryPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { games } = useGames();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const game = games.find(g => g.id === id);

  useEffect(() => {
    const fetchCategories = async () => {
      const { data } = await supabase.from('game_categories').select('*').eq('game_id', id);
      setCategories(data || []);
      setLoading(false);
    };
    fetchCategories();
  }, [id]);

  return (
    <div className="min-h-screen px-4 py-6 bg-[#f3f4f6] dark:bg-gray-900">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-5">
          <button onClick={() => navigate('/games')} className="text-slate-700 dark:text-white/80 hover:text-purple-600 text-sm inline-flex items-center gap-2 font-medium">
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <StepIndicator currentStep={2} />
        </div>

        <h1 className="text-2xl font-black text-slate-800 dark:text-white mb-1">{game?.name || 'Game'} Topup</h1>
        <p className="text-sm text-slate-500 mb-6">Step 2: Choose Category</p>

        {loading ? <p className="text-center text-gray-500">Loading...</p> : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {categories.map((cat) => (
              <div key={cat.id} onClick={() => navigate(`/games/${id}/category/${cat.id}`)}>
                <Card variant="gaming" padding="md" hover clickable className="flex items-center justify-between cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-2xl">{cat.icon}</div>
                    <div>
                      <h3 className="font-bold text-gray-800 dark:text-white text-lg">{cat.name}</h3>
                      <p className="text-xs text-gray-500">{cat.description || 'Select this category'}</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </Card>
              </div>
            ))}
            {categories.length === 0 && <p className="text-gray-500">No categories found for this game.</p>}
          </div>
        )}
      </div>
    </div>
  );
};
export default CategoryPage;
