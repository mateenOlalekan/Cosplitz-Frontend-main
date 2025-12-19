// pages/SplitCardPage.jsx
import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Users, DollarSign, Calendar, MapPin, Eye } from 'lucide-react';
import useSplitStore from '../../store/splitStore';
import { splitService } from '../../services/splitService';

const SplitCardPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { cardedSplits, setCardedSplits, setCurrentSplit } = useSplitStore();

  useEffect(() => {
    if (!cardedSplits.length) {
      fetchCardedSplits();
    }
  }, []);

  const fetchCardedSplits = async () => {
    try {
      const splits = await splitService.getSplits();
      const carded = splits.filter(split => split.split_method === 'SpecificAmounts');
      setCardedSplits(carded);
    } catch (error) {
      console.error('Error fetching carded splits:', error);
    }
  };

  const handleViewSplit = (split) => {
    setCurrentSplit(split);
    navigate(`/splits/${split.id}`);
  };

  const goBack = () => {
    navigate(-1);
  };

  const currentSplit = cardedSplits.find(split => split.id.toString() === id);

  if (!currentSplit) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading split card...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <button
        onClick={goBack}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium mb-6"
      >
        <ChevronLeft size={20} />
        Back
      </button>

      <div className="max-w-md mx-auto">
        {/* Split Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden transform transition-all hover:scale-[1.02]">
          {/* Card Header with Image */}
          {currentSplit.image_url ? (
            <div className="h-56 overflow-hidden">
              <img
                src={currentSplit.image_url}
                alt={currentSplit.title}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="h-56 bg-gradient-to-r from-green-500 to-blue-500 flex items-center justify-center">
              <div className="text-center text-white">
                <div className="text-4xl font-bold mb-2">₦{currentSplit.amount?.toLocaleString()}</div>
                <div className="text-lg">{currentSplit.title}</div>
              </div>
            </div>
          )}

          {/* Card Body */}
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{currentSplit.title}</h1>
                <span className="inline-block px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full mt-2">
                  {currentSplit.category}
                </span>
              </div>
            </div>

            {/* Card Details */}
            <div className="space-y-4 mb-6">
              <div className="flex items-center gap-3 text-gray-700">
                <DollarSign size={20} className="text-green-600" />
                <span className="font-medium">Amount:</span>
                <span className="font-bold text-gray-900">₦{currentSplit.amount?.toLocaleString()}</span>
              </div>

              <div className="flex items-center gap-3 text-gray-700">
                <Users size={20} className="text-blue-600" />
                <span className="font-medium">Participants:</span>
                <span className="font-bold text-gray-900">{currentSplit.max_participants}</span>
              </div>

              <div className="flex items-center gap-3 text-gray-700">
                <Calendar size={20} className="text-purple-600" />
                <div>
                  <div className="font-medium">Date Range:</div>
                  <div className="text-sm text-gray-600">
                    {new Date(currentSplit.start_date).toLocaleDateString()} -{' '}
                    {new Date(currentSplit.end_date).toLocaleDateString()}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 text-gray-700">
                <MapPin size={20} className="text-red-600" />
                <div>
                  <div className="font-medium">Location:</div>
                  <div className="text-sm text-gray-600">{currentSplit.location}</div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={() => handleViewSplit(currentSplit)}
                className="w-full flex items-center justify-center gap-2 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition"
              >
                <Eye size={20} />
                View Split Details
              </button>
              
              <button
                onClick={() => {
                  setCurrentSplit(currentSplit);
                  navigate(`/splits/${currentSplit.id}`);
                }}
                className="w-full py-3 border-2 border-green-600 text-green-600 rounded-xl font-semibold hover:bg-green-50 transition"
              >
                Join This Split
              </button>
            </div>

            {/* Split Progress */}
            <div className="mt-6 pt-6 border-t">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Split Progress</span>
                <span>0% Complete</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-green-500 rounded-full w-0"></div>
              </div>
              <p className="text-xs text-gray-500 mt-2 text-center">
                Be the first to join this split!
              </p>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-6 bg-white rounded-2xl p-4 shadow">
          <h3 className="font-semibold text-gray-900 mb-2">About This Split</h3>
          <p className="text-sm text-gray-600">
            This is a {currentSplit.split_method} split. All participants will share the total amount equally.
            Join now to become part of this collaborative expense sharing.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SplitCardPage;