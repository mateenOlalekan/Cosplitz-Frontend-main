import { 
  Users, 
  Calendar, 
  MapPin, 
  Clock, 
  DollarSign,
  TrendingUp
} from 'lucide-react';

const SplitCard = ({ split, onJoin }) => {
  const calculateProgress = () => {
    const current = split.participants_count || 0;
    const max = split.max_participants || 1;
    return Math.min((current / max) * 100, 100);
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'open':
        return 'bg-green-100 text-green-800';
      case 'closed':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(amount || 0);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-200 overflow-hidden">
      {/* Split Image */}
      {split.image_url && (
        <div className="h-48 overflow-hidden">
          <img
            src={split.image_url}
            alt={split.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="p-5">
        {/* Header */}
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="font-bold text-lg text-gray-900 mb-1">{split.title}</h3>
            <div className="flex items-center gap-2">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(split.status)}`}>
                {split.status || 'Open'}
              </span>
              <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs">
                {split.category}
              </span>
            </div>
          </div>
          
          <div className="text-right">
            <p className="text-2xl font-bold text-green-700">{formatCurrency(split.amount)}</p>
            <p className="text-sm text-gray-500">Total</p>
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {split.description || 'No description provided'}
        </p>

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="flex items-center gap-2">
            <Users size={16} className="text-gray-400" />
            <div>
              <p className="text-sm text-gray-600">Participants</p>
              <p className="font-medium">
                {split.participants_count || 0}/{split.max_participants || 1}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <DollarSign size={16} className="text-gray-400" />
            <div>
              <p className="text-sm text-gray-600">Per Person</p>
              <p className="font-medium">
                {formatCurrency(split.amount / (split.max_participants || 1))}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <MapPin size={16} className="text-gray-400" />
            <div>
              <p className="text-sm text-gray-600">Location</p>
              <p className="font-medium truncate" title={split.location}>
                {split.location || 'Not specified'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Clock size={16} className="text-gray-400" />
            <div>
              <p className="text-sm text-gray-600">Deadline</p>
              <p className="font-medium">
                {split.end_date ? new Date(split.end_date).toLocaleDateString() : 'N/A'}
              </p>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-600">Progress</span>
            <span className="font-medium">{Math.round(calculateProgress())}%</span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-green-600 rounded-full transition-all"
              style={{ width: `${calculateProgress()}%` }}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onJoin}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2.5 rounded-lg font-medium transition-colors"
          >
            Join Splitz
          </button>
          <button
            onClick={() => window.location.href = `/splits/${split.id}`}
            className="px-4 py-2.5 border border-gray-300 hover:bg-gray-50 rounded-lg font-medium transition-colors"
          >
            View
          </button>
        </div>

        {/* Additional Info */}
        <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <Calendar size={12} />
            <span>Created: {split.created_at ? new Date(split.created_at).toLocaleDateString() : 'N/A'}</span>
          </div>
          <div className="flex items-center gap-1">
            <TrendingUp size={12} />
            <span>{split.split_method === 'SpecificAmounts' ? 'Equal Split' : 'Custom Split'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SplitCard;