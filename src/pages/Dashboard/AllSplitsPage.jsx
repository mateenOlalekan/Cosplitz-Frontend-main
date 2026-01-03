import { useState, useEffect } from 'react';
import { Search, Filter, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useSplitStore from '../../store/splitStore';
import SplitCard from '../../components/SplitCard';

const AllSplitsPage = () => {
  const navigate = useNavigate();
  const { splits, cardedSplits, isLoading, loadSplits } = useSplitStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    loadSplits();
  }, [loadSplits]);

  const categories = [
    'All',
    'Housing',
    'Food & Groceries',
    'Transportation',
    'Events & Tickets',
    'Utilities',
    'Entertainment',
    'Other'
  ];

  const filteredSplits = (cardedSplits.length > 0 ? cardedSplits : splits).filter(split => {
    const matchesSearch = split.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         split.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         split.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || split.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">All Available Splits</h1>
              <p className="text-gray-600 mt-1">Join splits created by others or create your own</p>
            </div>
            <button
              onClick={() => navigate('/create-split')}
              className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition shadow-sm"
            >
              <Plus size={20} />
              Create New Split
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filter */}
        <div className="mb-8 space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search splits by title, description, or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
            />
          </div>

          {/* Category Filters */}
          <div className="flex items-center gap-4">
            <Filter size={20} className="text-gray-500" />
            <div className="flex flex-wrap gap-2">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category === 'All' ? 'all' : category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                    (category === 'All' && selectedCategory === 'all') || 
                    selectedCategory === category
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Splits Grid */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          </div>
        ) : filteredSplits.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSplits.map(split => (
              <SplitCard key={split.id} split={split} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-gray-400 mb-4">
              <svg className="w-24 h-24 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No splits found</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || selectedCategory !== 'all' 
                ? 'Try adjusting your search or filter criteria'
                : 'Be the first to create a split in your community!'}
            </p>
            <button
              onClick={() => navigate('/create-split')}
              className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition"
            >
              <Plus size={20} />
              Create Your First Split
            </button>
          </div>
        )}

        {/* Stats */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <p className="text-sm text-gray-600">Total Splits</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{splits.length}</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <p className="text-sm text-gray-600">Available to Join</p>
              <p className="text-3xl font-bold text-green-600 mt-2">
                {splits.filter(s => (s.current_participants || 0) < s.max_participants).length}
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <p className="text-sm text-gray-600">Active Participants</p>
              <p className="text-3xl font-bold text-blue-600 mt-2">
                {splits.reduce((acc, split) => acc + (split.current_participants || 0), 0)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllSplitsPage;