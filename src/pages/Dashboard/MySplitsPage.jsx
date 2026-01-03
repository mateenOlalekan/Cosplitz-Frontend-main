import { useState, useEffect } from 'react';
import { Package, Users, Calendar, DollarSign, Edit, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useSplitStore from '../../store/splitStore';

const MySplitsPage = () => {
  const navigate = useNavigate();
  const { mySplits, isLoading, loadMySplits, removeSplit } = useSplitStore();
  const [activeTab, setActiveTab] = useState('active');

  useEffect(() => {
    loadMySplits();
  }, [loadMySplits]);

  const filteredSplits = mySplits.filter(split => {
    if (activeTab === 'active') return split.status === 'active';
    if (activeTab === 'completed') return split.status === 'completed';
    if (activeTab === 'joined') return split.joined === true;
    return true;
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const handleDeleteSplit = async (splitId) => {
    if (window.confirm('Are you sure you want to delete this split?')) {
      removeSplit(splitId);
      // You would also call an API to delete from backend here
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">My Splits</h1>
              <p className="text-gray-600 mt-1">Manage your created and joined splits</p>
            </div>
            <button
              onClick={() => navigate('/create-split')}
              className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition shadow-sm"
            >
              <Package size={20} />
              Create New Split
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'active', label: 'Active', count: mySplits.filter(s => s.status === 'active').length },
                { id: 'joined', label: 'Joined', count: mySplits.filter(s => s.joined === true).length },
                { id: 'completed', label: 'Completed', count: mySplits.filter(s => s.status === 'completed').length },
                { id: 'all', label: 'All', count: mySplits.length }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    py-4 px-1 border-b-2 font-medium text-sm
                    ${activeTab === tab.id
                      ? 'border-green-500 text-green-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }
                  `}
                >
                  {tab.label}
                  <span className="ml-2 bg-gray-100 text-gray-900 py-0.5 px-2 rounded-full text-xs">
                    {tab.count}
                  </span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Splits List */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          </div>
        ) : filteredSplits.length > 0 ? (
          <div className="space-y-6">
            {filteredSplits.map(split => (
              <div key={split.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    {/* Split Info */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-bold text-lg text-gray-900">{split.title}</h3>
                            <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                              split.status === 'active' 
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {split.status || 'active'}
                            </span>
                          </div>
                          <p className="text-gray-600 mb-4 line-clamp-2">{split.description}</p>
                          
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            <div className="flex items-center gap-2">
                              <Users size={16} className="text-gray-400" />
                              <span className="text-sm text-gray-600">
                                {split.current_participants || 0}/{split.max_participants}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <DollarSign size={16} className="text-gray-400" />
                              <span className="text-sm text-gray-600">
                                {formatCurrency(split.amount / split.max_participants)} each
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Calendar size={16} className="text-gray-400" />
                              <span className="text-sm text-gray-600">
                                {formatDate(split.end_date)}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Package size={16} className="text-gray-400" />
                              <span className="text-sm text-gray-600 capitalize">
                                {split.split_method?.toLowerCase().replace('amounts', '')}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Progress Bar */}
                      <div className="mb-4">
                        <div className="flex justify-between text-sm text-gray-600 mb-1">
                          <span>Progress</span>
                          <span>
                            {Math.round(((split.current_participants || 0) / split.max_participants) * 100)}%
                          </span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-green-500 rounded-full transition-all duration-300"
                            style={{ 
                              width: `${((split.current_participants || 0) / split.max_participants) * 100}%` 
                            }}
                          />
                        </div>
                      </div>
                    </div>
                    
                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row lg:flex-col gap-3">
                      <button
                        onClick={() => navigate(`/split/${split.id}`)}
                        className="px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition text-sm"
                      >
                        View Details
                      </button>
                      <button
                        onClick={() => navigate(`/edit-split/${split.id}`)}
                        className="px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition text-sm flex items-center justify-center gap-2"
                      >
                        <Edit size={16} />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteSplit(split.id)}
                        className="px-4 py-2 bg-red-50 text-red-600 font-medium rounded-lg hover:bg-red-100 transition text-sm flex items-center justify-center gap-2"
                      >
                        <Trash2 size={16} />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-gray-400 mb-4">
              <Package size={80} className="mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {activeTab === 'active' && 'No active splits'}
              {activeTab === 'joined' && 'No joined splits'}
              {activeTab === 'completed' && 'No completed splits'}
              {activeTab === 'all' && 'No splits yet'}
            </h3>
            <p className="text-gray-600 mb-6">
              {activeTab === 'all' 
                ? 'Get started by creating your first split!'
                : `You don't have any ${activeTab} splits.`}
            </p>
            <button
              onClick={() => navigate('/create-split')}
              className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition"
            >
              <Package size={20} />
              Create Your First Split
            </button>
          </div>
        )}

        {/* Stats Summary */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <p className="text-sm text-gray-600">Total Created</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {mySplits.filter(s => !s.joined).length}
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <p className="text-sm text-gray-600">Total Joined</p>
              <p className="text-3xl font-bold text-blue-600 mt-2">
                {mySplits.filter(s => s.joined).length}
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <p className="text-sm text-gray-600">Total Amount</p>
              <p className="text-3xl font-bold text-green-600 mt-2">
                {formatCurrency(mySplits.reduce((acc, split) => acc + split.amount, 0))}
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <p className="text-sm text-gray-600">Active Participants</p>
              <p className="text-3xl font-bold text-purple-600 mt-2">
                {mySplits.reduce((acc, split) => acc + (split.current_participants || 0), 0)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MySplitsPage;