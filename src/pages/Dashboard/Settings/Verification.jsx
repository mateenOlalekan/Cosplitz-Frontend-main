import Verified from '../../../assets/Verified.svg';
import Failed from '../../../assets/Failed.svg';
import Pending from '../../../assets/Pending.svg';

const STATUS_CONFIG = {
  verified: {
    image: Verified,
    title: 'Verification In Progress',
    description:
      'Your submitted documents and information have been carefully reviewed and vetted.',
    color: 'text-gray-800',
    action: null,
  },
  failed: {
    image: Failed,
    title: 'Failed',
    description:
      'Your submitted documents and information have been reviewed but did not meet the requirements.',
    color: 'text-gray-800',
    action: (
      <button className="bg-green-800 text-white px-4 py-2 rounded-lg mt-3 text-sm">
        Re-submit
      </button>
    ),
  },
  pending: {
    image: Pending,
    title: 'Pending',
    description:
      'Your submitted documents and information are still under review. You will be notified via email once verification is complete.',
    color: 'text-yellow-600',
    action: null,
  },
};

export default function Verification() {
  // 🔁 Change this value based on API response
  const status = 'pending'; // 'verified' | 'failed' | 'pending'

  const { image, title, description, color, action } =
    STATUS_CONFIG[status];

  return (
    <div className="p-4 w-full">
      
      {/* ===== HEADER ===== */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        <div className="flex flex-col">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
            Verification Status
          </h2>
          <span className="text-gray-600 text-xs sm:text-sm mt-1 leading-relaxed">
            See the progress of your submitted details
          </span>
        </div>
      </div>

      {/* ===== CONTENT ===== */}
      <div className="bg-white rounded-xl p-4 sm:p-6 border border-gray-200 ">
        <div className="w-full flex justify-center items-center my-4">
          <div className="flex flex-col items-center text-center max-w-md w-full gap-4">

            <img
              src={image}
              alt="Verification Status"
              className="w-24 sm:w-32 lg:w-40 object-contain"
            />

            <h3 className={`text-lg sm:text-xl font-semibold ${color}`}>
              {title}
            </h3>

            <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
              {description}
            </p>

            {action}

          </div>
        </div>
      </div>
    </div>
  );
}
