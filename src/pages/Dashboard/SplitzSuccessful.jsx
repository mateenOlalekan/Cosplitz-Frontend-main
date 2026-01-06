
// import CheckLast from "../../assets/CheckLast.svg";

// function SplitzSuccessful() {
//   return (
//     <div className="w-full h-screen flex  items-center bg-white">
//       <div className="shadow-md max-w-xl rounded-2xl p-6 bg-white flex flex-col items-center gap-4">
        
//         {/* Success Image */}
//         <img src={CheckLast} alt="Payment Successful" className="w-20 h-20" />

//         {/* Message */}
//         <div className="flex flex-col text-center gap-1">
//           <h1 className="text-2xl font-semibold text-gray-900">PAYMENT SUCCESSFUL</h1>
//           <p className="text-gray-600 text-sm">Your Splitz has been created</p>
//         </div>

//         {/* Action Buttons */}
//         <div className="flex flex-col sm:flex-row gap-3 mt-4 w-full">
//           <button className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-medium transition">
//             View Splitz
//           </button>
//           <button className="flex-1 border-2 border-green-600 text-green-600 hover:bg-green-50 py-2 rounded-lg font-medium transition">
//             Share With Friends
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default SplitzSuccessful;

import { useNavigate, useLocation } from "react-router-dom";
import CheckLast from "../../assets/CheckLast.svg";

function SplitzSuccessful() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get the newly created split data from navigation state
  const newSplit = location.state?.split;

  const handleViewSplitz = () => {
    navigate('/dashboard/mysplitz');
  };

  const handleShare = () => {
    // Implement share functionality
    if (navigator.share && newSplit) {
      navigator.share({
        title: newSplit.title,
        text: `Join my Splitz: ${newSplit.title}`,
        url: window.location.origin + `/dashboard/splitz-details/${newSplit.id}`
      }).catch(err => console.log('Share failed:', err));
    } else {
      // Fallback: copy link to clipboard
      if (newSplit) {
        const link = `${window.location.origin}/dashboard/splitz-details/${newSplit.id}`;
        navigator.clipboard.writeText(link);
        alert('Link copied to clipboard!');
      }
    }
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="shadow-lg max-w-xl w-full rounded-2xl p-8 bg-white flex flex-col items-center gap-6">
        
        {/* Success Image */}
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
          <img src={CheckLast} alt="Payment Successful" className="w-16 h-16" />
        </div>

        {/* Message */}
        <div className="flex flex-col text-center gap-2">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            SPLITZ CREATED SUCCESSFULLY!
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">
            Your Splitz has been created and is now live
          </p>
          
          {newSplit && (
            <div className="mt-3 p-4 bg-green-50 rounded-lg">
              <p className="text-sm font-semibold text-green-800">{newSplit.title}</p>
              <p className="text-xs text-green-600 mt-1">
                {newSplit.max_participants} participants needed
              </p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 mt-4 w-full">
          <button 
            onClick={handleViewSplitz}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold transition-colors duration-200 shadow-md"
          >
            View My Splitz
          </button>
          <button 
            onClick={handleShare}
            className="flex-1 border-2 border-green-600 text-green-600 hover:bg-green-50 py-3 rounded-lg font-semibold transition-colors duration-200"
          >
            Share With Friends
          </button>
        </div>

        {/* Additional Info */}
        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500">
            You can view and manage your Splitz anytime from your dashboard
          </p>
        </div>
      </div>
    </div>
  );
}

export default SplitzSuccessful;