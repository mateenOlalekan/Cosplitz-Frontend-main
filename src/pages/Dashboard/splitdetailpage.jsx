// import { ChevronLeft, Share2, Users, MapPin,LockKeyhole, Clock, Heart, ChevronDown, User,  TrendingUp,  Wallet, CreditCard, Building2, Star, Shield, Flag } from "lucide-react";
// import { useState } from "react";

// function SplitzDetail() {
//   const [selectedPayment, setSelectedPayment] = useState('Wallet');
  
//   // Calculate progress based on participants (3 out of 5 = 60%)
//   const progress = (3 / 5) * 100;

//   // Card styling for consistency
//   const cardStyle = "rounded-xl bg-white p-5 shadow-sm shadow-[#D0C9D6]";

//   return (
//     <div className="flex flex-col w-full min-h-screen bg-white">
//       {/* Header */}
//       <header className="flex items-center justify-between px-4 md:px-10 py-4 shadow-sm bg-white">
//         <button className="flex items-center">
//           <ChevronLeft size={20} />
//         </button>

//         <p className="text-lg font-semibold">Splitz Detail</p>

//         <button className="flex items-center justify-center w-8 h-8 bg-slate-200 rounded-xl">
//           <Share2 size={15} />
//         </button>
//       </header>

//       {/* Content */}
//       <div className="flex flex-col w-full mx-auto max-w-5xl px-4 md:px-10 pt-6 gap-6">
//         {/* Title & Tags */}
//         <div className="flex flex-col gap-3">
//           <span className="text-lg font-bold">Shared Taxi to Campus</span>

//           <div className="flex gap-3">
//             <span className="px-4 py-1 text-sm text-[#FB9851] bg-[#FB9851]/20 rounded-full">
//               Ride
//             </span>
//             <span className="px-4 py-1 text-sm bg-[#34ef82] text-white rounded-full">
//               Open
//             </span>
//           </div>
//         </div>

//         {/* Amount Card */}
//         <div className={cardStyle}>
//           {/* Amount */}
//           <div className="flex justify-between items-start pb-2 border-b border-[#D0C9D6]">
//             <div className="flex flex-col gap-1">
//               <p className="text-sm text-gray-500">Total Amount</p>
//               <p className="text-xl font-bold">$1000</p>
//             </div>

//             <div className="flex flex-col gap-1 text-right">
//               <p className="text-sm text-gray-500">Per person</p>
//               <p className="text-lg font-bold text-[#1F8225]">$200</p>
//             </div>
//           </div>

//           {/* Details */}
//           <div className="flex justify-between items-start pb-2 border-b border-[#D0C9D6] pt-3">
//             <div className="flex flex-col gap-4 text-sm text-gray-600">
//               <div className="flex items-center gap-2">
//                 <Users size={15} />
//                 <span>Participants</span>
//               </div>
//               <div className="flex items-center gap-2">
//                 <Clock size={15} />
//                 <span>Deadline</span>
//               </div>
//               <div className="flex items-center gap-2">
//                 <MapPin size={15} />
//                 <span>Distance</span>
//               </div>
//             </div>

//             <div className="flex flex-col gap-4 text-sm text-right">
//               <span className="font-medium">3 / 5 Joined</span>
//               <span className="text-red-600 font-medium">00:15:20</span>
//               <span className="text-gray-600">0.8 km away</span>
//             </div>
//           </div>

//           {/* Progress Bar */}
//           <div className="flex flex-col gap-2 pt-3">
//             <div className="w-full h-2 bg-[#D0C9D6] rounded-full overflow-hidden">
//               <div
//                 className="h-full bg-[#1F8225] rounded-full transition-all"
//                 style={{ width: `${progress}%` }}
//               />
//             </div>
//           </div>
//         </div>

//         {/* Pickup Details */}
//         <div className={cardStyle}>
//           <div className="flex gap-3 items-center text-black/90 text-lg">
//             <MapPin size={15} />
//             <p>Pick up Details</p>
//           </div>

//           <p className="text-[#67707E] mt-2">Lekki Phase 1 Gate</p>
//           <p className="text-[#1F8225] mt-1">Departure 5:30pm</p>
//         </div>

//         {/* Description */}
//         <div className={cardStyle}>
//           <p className="font-semibold text-black/90">Description</p>
//           <p className="text-[#67707E] mt-2">
//             Looking to split a ride to Yaba from Lekki. Leaving in about 3 hours.
//             Perfect for anyone heading to the mainland during rush hour......
//           </p>
//           <p className="text-[#1F8225] mt-2">Read more</p>
//         </div>


//         {/* Participants Section */}
//         <div className={cardStyle}>
//           <div className="flex items-center justify-between mb-4">
//             <h3 className="font-semibold text-gray-900">Participant (3)</h3>
//             <span className="text-xs text-gray-500">2 paid, 1 pending</span>
//           </div>
          
//           <div className="space-y-3">
//             {/* Host Row */}
//             <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
//               <div className="flex items-center gap-3">
//                 <div className="w-8 h-8 bg-blue-200 rounded-full flex items-center justify-center text-blue-700 text-sm font-bold">
//                   JD
//                 </div>

//                 <div className="flex flex-col gap-1">
//                   <div className="flex items-center gap-2">
//                     <span className="text-sm font-medium text-gray-900">Jane Daniel</span>
//                     <span className="px-2 py-0.5 bg-[#34EF82] text-white text-xs rounded-full">
//                       95% Trust
//                     </span>
//                   </div>

//                   <div className="flex items-center gap-1 text-xs text-gray-600">
//                     <Star size={12} className="text-yellow-400" />
//                     <span>4.5</span>
//                   </div>
//                 </div>
//               </div>

//              <Flag size={15}/>
//             </div>

//             <div className="p-3 flex gap-3 items-center bg-green-200 rounded-xl">
//                 <Shield className="text-bold text-[#1F8225]"/>
//                 <div className="flex flex-col">
//                     <p className="text-lg font-bold text-[#1F8225]">Trust Host</p>
//                     <p>Report 0 times an has Reliability score of 97 %</p>
//                 </div>
//             </div>

//           </div>
//         </div>
//         {/* Participants Section */}
//         <div className={cardStyle}>
//           <div className="flex items-center justify-between mb-4">
//             <h3 className="font-semibold text-gray-900">Participant (3)</h3>
//             <span className="text-xs text-gray-500">2 paid, 1 pending</span>
//           </div>
          
//           <div className="space-y-3">
//             {/* Host Row */}
//             <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
//               <div className="flex items-center gap-3">
//                 <div className="w-8 h-8 bg-blue-200 rounded-full flex items-center justify-center text-blue-700 text-sm font-bold">
//                   JD
//                 </div>

//                 <div className="flex flex-col gap-1">
//                   <div className="flex items-center gap-2">
//                     <span className="text-sm font-medium text-gray-900">Jane Daniel</span>
//                     <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs rounded-full">
//                       Host
//                     </span>
//                   </div>

//                   <div className="flex items-center gap-1 text-xs text-gray-600">
//                     <Star size={12} className="text-yellow-400" />
//                     <span>4.5</span>
//                   </div>
//                 </div>
//               </div>

//               <span className="px-3 py-1 bg-emerald-500 text-white text-xs rounded-full font-medium">
//                 Paid
//               </span>
//             </div>

//             {/* Paid User */}
//             <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
//               <div className="flex items-center gap-3">
//                 <div className="w-8 h-8 bg-blue-400 rounded-full flex items-center justify-center text-white text-sm font-bold">
//                   M
//                 </div>
//                 <div className="flex flex-col">
//                   <span className="text-sm font-medium text-gray-900">Mar_laze</span>
//                   <div className="flex items-center gap-1 text-xs text-gray-600">
//                     <Star size={12} className="text-yellow-400" />
//                     <span>4.2</span>
//                   </div>
//                 </div>
//               </div>
//               <span className="px-3 py-1 bg-emerald-500 text-white text-xs rounded-full font-medium">
//                 Paid
//               </span>
//             </div>

//             {/* Pending User */}
//             <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
//               <div className="flex items-center gap-3">
//                 <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-white text-sm font-bold">
//                   M
//                 </div>
//                 <div className="flex flex-col">
//                   <span className="text-sm font-medium text-gray-900">Mar_Jake</span>
//                   <div className="flex items-center gap-1 text-xs text-gray-600">
//                     <Star size={12} className="text-yellow-400" />
//                     <span>3.8</span>
//                   </div>
//                 </div>
//               </div>
//               <span className="text-xs text-gray-500">⏱ 3 hr</span>
//             </div>
//           </div>
//         </div>


//         {/* Activity Section */}
//         <div className={cardStyle}>
//           <h3 className="font-semibold text-gray-900 mb-4">Activity</h3>
          
//           <div className="space-y-4">
//             <div className="flex items-start gap-3">
//               <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
//                 <User className="w-4 h-4 text-emerald-600" />
//               </div>
//               <div>
//                 <p className="text-sm font-medium text-gray-900">User_9062 joined the Splitz</p>
//                 <p className="text-xs text-[#67707E] mt-0.5">15 min ago</p>
//               </div>
//             </div>

//             <div className="flex items-start gap-3">
//               <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
//                 <TrendingUp className="w-4 h-4 text-emerald-600" />
//               </div>
//               <div>
//                 <p className="text-sm font-medium text-gray-900">User_2009 completed payment</p>
//                 <p className="text-xs text-[#67707E] mt-0.5">15 min ago</p>
//               </div>
//             </div>

//             <div className="flex items-start gap-3">
//               <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
//                 <User className="w-4 h-4 text-emerald-600" />
//               </div>
//               <div>
//                 <p className="text-sm font-medium text-gray-900">User_9142 joined the Splitz</p>
//                 <p className="text-xs text-[#67707E] mt-0.5">2 hrs ago</p>
//               </div>
//             </div>

//             <div className="flex items-start gap-3">
//               <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
//                 <Clock className="w-4 h-4 text-red-600" />
//               </div>
//               <div>
//                 <p className="text-sm font-medium text-gray-900">Deadline is approaching</p>
//                 <p className="text-xs text-red-600 font-medium mt-0.5">6 hours remaining</p>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Payment Section */}
//         <div className={cardStyle}>
//           <h3 className="font-semibold text-gray-900 mb-4">Payment</h3>
//           <p className="text-xs text-gray-500 mb-3">(Choose payment method)</p>
          
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
//             <button
//               onClick={() => setSelectedPayment('Wallet')}
//               className={`p-4 rounded-xl border-2 transition-all ${
//                 selectedPayment === 'Wallet'
//                   ? 'border-emerald-500 bg-emerald-50'
//                   : 'border-gray-200 hover:border-gray-300'
//               }`}
//             >
//               <Wallet className="w-6 h-6 mx-auto mb-2 text-emerald-500" />
//               <p className="text-xs font-medium text-gray-900">Wallet</p>
//             </button>

//             <button
//               onClick={() => setSelectedPayment('Card')}
//               className={`p-4 rounded-xl border-2 transition-all ${
//                 selectedPayment === 'Card'
//                   ? 'border-emerald-500 bg-emerald-50'
//                   : 'border-gray-200 hover:border-gray-300'
//               }`}
//             >
//               <CreditCard className="w-6 h-6 mx-auto mb-2 text-gray-600" />
//               <p className="text-xs font-medium text-gray-900">Card</p>
//             </button>

//             <button
//               onClick={() => setSelectedPayment('Transfer')}
//               className={`p-4 rounded-xl border-2 transition-all ${
//                 selectedPayment === 'Transfer'
//                   ? 'border-emerald-500 bg-emerald-50'
//                   : 'border-gray-200 hover:border-gray-300'
//               }`}
//             >
//               <Building2 className="w-6 h-6 mx-auto mb-2 text-gray-600" />
//               <p className="text-xs font-medium text-gray-900">Transfer</p>
//             </button>
//           </div>

//           {/* Security Message */}
//           <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-start gap-2">
//             <Shield className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
//             <p className="text-xs text-emerald-700">Funds held securely in escrow until split completes</p>
//           </div>
//         </div>

//         {/* Terms & Conditions */}
//         <div className={cardStyle}>
//           <button className="w-full flex items-center justify-between">
//             <span className="font-semibold text-gray-900">Terms & Conditions</span>
//             <ChevronDown className="w-5 h-5 text-gray-400" />
//           </button>
//         </div>

//         {/* Safety & Disputes */}
//         <div className={cardStyle}>
//           <button className="w-full flex items-center justify-between">
//             <span className="font-semibold text-gray-900">Safety & Disputes</span>
//             <ChevronDown className="w-5 h-5 text-gray-400" />
//           </button>
//         </div>

//         {/* Action Buttons */}
//         <div className="py-5 flex gap-3">
//           <button className="w-12 h-12 border-2 border-[#67707E] rounded-xl flex items-center justify-center hover:border-gray-400 transition-colors">
//             <Heart className="w-5 h-5 text-[#67707E]" />
//           </button>
//           <button className="w-12 h-12 border-2 border-[#67707E] rounded-xl flex items-center justify-center hover:border-gray-400 transition-colors">
//             <Share2 className="w-5 h-5 text-[#67707E]" />
//           </button>
//           <button className="flex-1 bg-[#1F8225] text-white font-semibold py-3 rounded-xl transition-all shadow-lg hover:bg-[#16681d]">
//             Join & Pay $200
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default SplitzDetail;

import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Users, Calendar, DollarSign, MapPin, 
  Shield, AlertCircle, CheckCircle, UserPlus 
} from 'lucide-react';
import api from '../../services/splitApi';

const SplitDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [split, setSplit] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isJoining, setIsJoining] = useState(false);
  const [participants, setParticipants] = useState([]);

  useEffect(() => {
    fetchSplitDetails();
  }, [id]);

  const fetchSplitDetails = async () => {
    try {
      setIsLoading(true);
      const response = await api.get(`/splits/${id}/`);
      setSplit(response.data.data);
      // Fetch participants if endpoint exists
      try {
        const participantsRes = await api.get(`/splits/${id}/participants/`);
        setParticipants(participantsRes.data.data || []);
      } catch (e) {
        console.log('No participants endpoint');
      }
    } catch (error) {
      console.error('Error fetching split:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleJoinSplit = async () => {
    try {
      setIsJoining(true);
      await api.post(`/splits/${id}/join_splits/`);
      // Refresh the split data
      await fetchSplitDetails();
      alert('Successfully joined the split!');
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to join split');
    } finally {
      setIsJoining(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!split) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Split not found</h2>
          <button
            onClick={() => navigate('/dashboard/allsplits')}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Back to Splits
          </button>
        </div>
      </div>
    );
  }

  const isFull = split.current_participants >= split.max_participants;
  const isJoined = split.is_joined || participants.some(p => p.id === user?.id); // Check if user is in participants

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button
            onClick={() => navigate('/dashboard/allsplits')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft size={20} /> Back to Splits
          </button>
          
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{split.title}</h1>
              <p className="text-gray-600">{split.category}</p>
            </div>
            
            <div className="flex gap-3">
              {!isJoined && !isFull && (
                <button
                  onClick={handleJoinSplit}
                  disabled={isJoining}
                  className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition disabled:opacity-70"
                >
                  <UserPlus size={20} />
                  {isJoining ? 'Joining...' : 'Join Split'}
                </button>
              )}
              {isJoined && (
                <div className="flex items-center gap-2 px-6 py-3 bg-green-100 text-green-800 font-medium rounded-lg">
                  <CheckCircle size={20} />
                  Joined
                </div>
              )}
              {isFull && !isJoined && (
                <div className="flex items-center gap-2 px-6 py-3 bg-red-100 text-red-800 font-medium rounded-lg">
                  <AlertCircle size={20} />
                  Split is Full
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Split Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image */}
            {split.image && (
              <div className="rounded-xl overflow-hidden">
                <img 
                  src={split.image} 
                  alt={split.title}
                  className="w-full h-64 object-cover"
                />
              </div>
            )}

            {/* Description */}
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Description</h3>
              <p className="text-gray-700 whitespace-pre-line">{split.description}</p>
            </div>

            {/* Rules */}
            {split.rules && (
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Rules & Conditions</h3>
                <div className="space-y-4">
                  <div className="p-4 border-l-4 border-red-500 bg-red-50 rounded flex items-start gap-3">
                    <AlertCircle size={20} className="text-red-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-red-700 text-sm mb-1">Refund Policy</h4>
                      <p className="text-xs text-red-600">{split.rules}</p>
                    </div>
                  </div>
                  
                  <div className="p-4 border-l-4 border-green-600 bg-green-50 rounded flex items-start gap-3">
                    <Shield size={20} className="text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-green-700 text-sm mb-1">Payment Protection</h4>
                      <p className="text-xs text-green-600">All payments are secured and released only when conditions are met.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Info & Participants */}
          <div className="space-y-6">
            {/* Split Info Card */}
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Split Details</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <DollarSign size={20} className="text-gray-400" />
                    <span className="text-gray-700">Total Amount</span>
                  </div>
                  <span className="font-semibold">{formatCurrency(split.amount)}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Users size={20} className="text-gray-400" />
                    <span className="text-gray-700">Participants</span>
                  </div>
                  <span className="font-semibold">
                    {split.current_participants || 0}/{split.max_participants}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <DollarSign size={20} className="text-gray-400" />
                    <span className="text-gray-700">Each Pays</span>
                  </div>
                  <span className="font-semibold">
                    {formatCurrency(split.amount / split.max_participants)}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Calendar size={20} className="text-gray-400" />
                    <span className="text-gray-700">End Date</span>
                  </div>
                  <span className="font-semibold">
                    {new Date(split.end_date).toLocaleDateString()}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <MapPin size={20} className="text-gray-400" />
                    <span className="text-gray-700">Location</span>
                  </div>
                  <span className="font-semibold text-right">{split.location}</span>
                </div>
              </div>
            </div>

            {/* Participants List */}
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Participants</h3>
              <div className="space-y-3">
                {participants.length > 0 ? (
                  participants.map((participant) => (
                    <div key={participant.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="font-semibold text-green-600">
                          {participant.name?.charAt(0) || 'U'}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{participant.name || 'Anonymous'}</p>
                        <p className="text-sm text-gray-500">Joined {new Date(participant.joined_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-4">No participants yet</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SplitDetailPage;