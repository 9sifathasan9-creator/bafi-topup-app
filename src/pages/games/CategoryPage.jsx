import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import { supabase } from '../../supabaseClient';
import StepIndicator from '../../components/common/StepIndicator';
import Card from '../../components/ui/Card';
import { useGames } from '../../hooks/useGames'; // গেমের নাম দেখানোর জন্য

const CategoryPage = () => {
  const { id } = useParams(); // এখানে id হলো game_id
  const navigate = useNavigate();
  const { games } = useGames(); 
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [debugError, setDebugError] = useState(null);

  const currentGame = games?.find(g => g.id === id);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      setDebugError(null);
      
      const { data, error } = await supabase
        .from('game_categories')
        .select('*')
        .eq('game_id', id);

      if (error) {
        console.error('Category Fetch Error:', error);
        setDebugError(error.message);
      } else {
        setCategories(data || []);
      }
      setLoading(false);
    };
    
    if (id) fetchCategories();
  }, [id]);

  return (
    <div className="min-h-screen px-4 py-6 bg-[#f3f4f6] dark:bg-gray-900">
      <div className="max-w-3xl mx-auto">
        
        {/* ডিবাগ বার */}
        <div style={{backgroundColor: "#ef4444", color: "white", padding: "4px", fontSize: "10px", textAlign: "center", zIndex: 9999, marginBottom: "10px", borderRadius: "4px"}}>
          <strong>Debug:</strong> Loading = {loading ? "Yes" : "No"} | Categories = {categories.length} | Error = {debugError ? debugError : "None"}
        </div>

        <div className="flex items-center justify-between mb-5">
          <button onClick={() => navigate('/games')} className="text-slate-700 dark:text-white/80 hover:text-purple-600 text-sm inline-flex items-center gap-2 font-medium">
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <StepIndicator currentStep={2} />
        </div>

        <h1 className="text-2xl font-black text-slate-800 dark:text-white mb-1">
          {currentGame?.name || 'Game'} Topup
        </h1>
        <p className="text-sm text-slate-500 mb-6">Step 2: Choose Category</p>

        {loading ? (
          <p className="text-center text-gray-500 py-10">Loading categories...</p>
        ) : categories.length === 0 ? (
          <div className="text-center py-10 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
            <p className="text-gray-500 mb-2">No categories found for this game.</p>
            <p className="text-xs text-gray-400">Please check the admin panel to add categories.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {categories.map((cat) => (
              <div key={cat.id} onClick={() => navigate(`/games/${id}/category/${cat.id}`)}>
                <Card variant="gaming" padding="md" hover clickable className="flex items-center justify-between cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-2xl">{cat.icon || '📦'}</div>
                    <div>
                      <h3 className="font-bold text-gray-800 dark:text-white text-lg">{cat.name}</h3>
                      <p className="text-xs text-gray-500">{cat.description || 'Select this category'}</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </Card>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;
