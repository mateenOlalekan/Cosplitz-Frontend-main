
import CheckLast from "../../assets/CheckLast.svg";

function SplitzSuccessful() {
  return (
    <div className="w-full h-screen flex  items-center bg-white">
      <div className="shadow-md max-w-xl rounded-2xl p-6 bg-white flex flex-col items-center gap-4">
        
        {/* Success Image */}
        <img src={CheckLast} alt="Payment Successful" className="w-20 h-20" />

        {/* Message */}
        <div className="flex flex-col text-center gap-1">
          <h1 className="text-2xl font-semibold text-gray-900">PAYMENT SUCCESSFUL</h1>
          <p className="text-gray-600 text-sm">Your Splitz has been created</p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 mt-4 w-full">
          <button className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-medium transition">
            View Splitz
          </button>
          <button className="flex-1 border-2 border-green-600 text-green-600 hover:bg-green-50 py-2 rounded-lg font-medium transition">
            Share With Friends
          </button>
        </div>
      </div>
    </div>
  );
}

export default SplitzSuccessful;
