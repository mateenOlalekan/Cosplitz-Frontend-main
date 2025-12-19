// pages/AllTasksPage.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Users, DollarSign, Calendar, MapPin, ArrowRight } from 'lucide-react';
import useSplitStore from '../../store/splitStore';
import { splitService } from '../../services/splitService';

const AllTasksPage = () => {
  const navigate = useNavigate();
  const { splits, cardedSplits, setSplits, setCardedSplits, setCurrentSplit } = useSplitStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllSplits();
  }, []);

  const fetchAllSplits = async () => {
    try {
      setLoading(true);
      const allSplits = await splitService.getSplits();
      setSplits(allSplits);
      
      const carded = allSplits.filter(split => split.split_method === 'SpecificAmounts');
      setCardedSplits(carded);
    } catch (error) {
      console.error('Error fetching splits:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSplit = () => {
    navigate('/create-split');
  };

  const handleViewSplit = (split) => {
    setCurrentSplit(split);
    if (split.split_method === 'SpecificAmounts') {
      navigate(`/split-card/${split.id}`);
    } else {
      navigate(`/splits/${split.id}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading splits...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">All Splitz Tasks</h1>
            <button
              onClick={handleCreateSplit}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              <Plus size={20} />
              Create New Split
            </button>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Carded Splits Section */}
        {cardedSplits.length > 0 && (
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">Carded Splits</h2>
              <span className="text-sm text-gray-600">{cardedSplits.length} items</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cardedSplits.map((split) => (
                <div
                  key={split.id}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                >
                  {split.image_url && (
                    <div className="h-40 overflow-hidden">
                      <img
                        src={split.image_url}
                        alt={split.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="p-4">
                    <h3 className="font-bold text-gray-900 mb-2">{split.title}</h3>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <DollarSign size={16} />
                        <span>₦{split.amount?.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Users size={16} />
                        <span>{split.max_participants} participants</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin size={16} />
                        <span className="truncate">{split.location}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleViewSplit(split)}
                      className="w-full flex items-center justify-center gap-2 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                    >
                      View Split
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* All Splits Section */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900">All Splits</h2>
            <span className="text-sm text-gray-600">{splits.length} total</span>
          </div>
          <div className="bg-white rounded-xl shadow overflow-hidden">
            {splits.length > 0 ? (
              <div className="divide-y">
                {splits.map((split) => (
                  <div
                    key={split.id}
                    className="p-4 hover:bg-gray-50 transition cursor-pointer"
                    onClick={() => handleViewSplit(split)}
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-gray-900">{split.title}</h3>
                          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">
                            {split.category}
                          </span>
                          {split.split_method === 'SpecificAmounts' && (
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">
                              Carded
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <DollarSign size={14} />
                            <span>₦{split.amount?.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Users size={14} />
                            <span>{split.max_participants} participants</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar size={14} />
                            <span>{new Date(split.start_date).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                      <ArrowRight size={20} className="text-gray-400" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <Users size={48} className="mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No splits yet</h3>
                <p className="text-gray-600 mb-4">Create your first split to get started!</p>
                <button
                  onClick={handleCreateSplit}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                >
                  <Plus size={20} />
                  Create Split
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AllTasksPage;