import { useState } from 'react';
import { Users, MapPin, Calendar, Lock, Unlock } from 'lucide-react';
import { splitService } from '../../services/splitService';
import useSplitStore from '../../store/splitStore';

const SplitCard = ({ split }) => {
  const { addParticipant } = useSplitStore();
  const [isJoining, setIsJoining] = useState(false);
  const [isJoined, setIsJoined] = useState(false);

  const handleJoinSplit = async () => {
    try {
      setIsJoining(true);
      const userId = JSON.parse(localStorage.getItem('user')).id;
      await splitService.joinSplit(split.id, userId);
      
      // Update store
      addParticipant(split.id, { user_id: userId });
      setIsJoined(true);
      
      alert('Successfully joined the split!');
    } catch (error) {
      console.error('Error joining split:', error);
      alert(`Failed to join split: ${error.message}`);
    } finally {
      setIsJoining(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN'
    }).format(amount);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      {/* Image */}
      {split.image_url && (
        <div className="h-48 overflow-hidden">
          <img
            src={split.image_url}
            alt={split.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      
      {/* Content */}
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="font-bold text-lg text-gray-900 mb-1">{split.title}</h3>
            <span className="inline-block px-3 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
              {split.category}
            </span>
          </div>
          <div className="text-right">
            <p className="font-bold text-2xl text-green-600">{formatCurrency(split.amount)}</p>
            <p className="text-xs text-gray-500">Total</p>
          </div>
        </div>
        
        {/* Details */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center gap-2 text-gray-600">
            <Users size={16} />
            <span className="text-sm">
              {split.current_participants || 0} / {split.max_participants} participants
            </span>
          </div>
          
          <div className="flex items-center gap-2 text-gray-600">
            <MapPin size={16} />
            <span className="text-sm">{split.location}</span>
          </div>
          
          <div className="flex items-center gap-2 text-gray-600">
            <Calendar size={16} />
            <span className="text-sm">
              {formatDate(split.start_date)} - {formatDate(split.end_date)}
            </span>
          </div>
          
          <div className="flex items-center gap-2 text-gray-600">
            {split.visibility_radius > 0 ? (
              <>
                <Unlock size={16} className="text-green-600" />
                <span className="text-sm">
                  Public (within {split.visibility_radius}km)
                </span>
              </>
            ) : (
              <>
                <Lock size={16} className="text-gray-400" />
                <span className="text-sm">Private split</span>
              </>
            )}
          </div>
        </div>
        
        {/* Progress bar */}
        <div className="mb-6">
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
        
        {/* Join Button */}
        <button
          onClick={handleJoinSplit}
          disabled={isJoining || isJoined || (split.current_participants || 0) >= split.max_participants}
          className={`w-full py-3 rounded-lg font-medium transition ${
            isJoined
              ? 'bg-gray-100 text-gray-600 cursor-not-allowed'
              : (split.current_participants || 0) >= split.max_participants
              ? 'bg-red-100 text-red-600 cursor-not-allowed'
              : 'bg-green-600 text-white hover:bg-green-700'
          }`}
        >
          {isJoining
            ? 'Joining...'
            : isJoined
            ? 'Joined ✓'
            : (split.current_participants || 0) >= split.max_participants
            ? 'Split Full'
            : 'Join Split'}
        </button>
        
        {/* Split method indicator */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          <p className="text-xs text-gray-500">
            Split method: <span className="font-medium text-gray-700">{split.split_method}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SplitCard;