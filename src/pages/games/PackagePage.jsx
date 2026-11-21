import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { supabase } from '../../supabaseClient';
import StepIndicator from '../../components/common/StepIndicator';
import Card from '../../components/ui/Card';
import { formatBDT } from '../../utils/formatters';

const PackagePage = () => {
  const { id, catId } = useParams();
  const navigate = useNavigate();
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPkg, setSelectedPkg] = useState(null);

  useEffect(() => {
    const fetchPackages = async () => {
      const { data } = await supabase.from('game_packages').select('*').eq('category_id', catId);
      setPackages(data || []);
      setLoading(false);
    };
    fetchPackages();
  }, [catId]);

  const handleContinue = () => {
    if (!selectedPkg) return;
    // চেকআউট পেজে ডাটা পাঠানো
    navigate('/checkout', { state: { gameId: id, packageData: selectedPkg } });
  };

  return (
    <div className="min-h-screen px-4 py-6 bg-[#f3f4f6] dark:bg-gray-900 pb-24 relative">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-5">
          <button onClick={() => navigate(-1)} className="text-slate-700 dark:text-white/80 hover:text-purple-600 text-sm inline-flex items-center gap-2 font-medium">
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <StepIndicator currentStep={3} />
        </div>

        <h1 className="text-2xl font-black text-slate-800 dark:text-white mb-1">Select Package</h1>
        <p className="text-sm text-slate-500 mb-6">Step 3: Choose Amount</p>

        {loading ? <p className="text-center text-gray-500">Loading...</p> : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {packages.map((pkg) => (
              <div key={pkg.id} onClick={() => setSelectedPkg(pkg)}>
                <Card 
                  variant="gaming" 
                  padding="md" 
                  className={`relative flex flex-col items-center justify-center py-6 cursor-pointer border-2 transition-all ${
                    selectedPkg?.id === pkg.id 
                      ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20 shadow-lg shadow-purple-500/20' 
                      : 'border-transparent'
                  }`}
                >
                  {selectedPkg?.id === pkg.id && (
                    <CheckCircle className="absolute top-2 right-2 w-5 h-5 text-purple-600" />
                  )}
                  <span className="text-3xl font-black text-gray-800 dark:text-white mb-1">{pkg.amount}</span>
                  <span className="text-xs text-gray-500 mb-2">{pkg.name}</span>
                  <span className="text-sm font-bold text-purple-600">{formatBDT(pkg.price)}</span>
                </Card>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ফিক্সড কন্টিনিউ বাটন */}
      {selectedPkg && (
        <div className="fixed bottom-0 inset-x-0 p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-2xl animate-slide-up z-50">
          <div className="max-w-3xl mx-auto">
            <button onClick={handleContinue} className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition">
              Continue with {selectedPkg.name} - {formatBDT(selectedPkg.price)}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
export default PackagePage;
