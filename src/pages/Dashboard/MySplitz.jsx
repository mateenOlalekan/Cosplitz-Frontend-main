import {
  ChevronDown,
  Bell,
  Settings,
  MapPin,
  ListFilter,
  Search,
} from "lucide-react";
import screen from "../../assets/screen.svg";
import { useNavigate, Link } from "react-router-dom";

function MySplitz() {
  const navigate = useNavigate();

  const goCreateSplitz = () => {
    navigate("/dashboard/create-splitz");
  };

  return (
    <div className="w-full flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <div className="w-full flex items-center justify-between py-3 px-4 md:px-6 bg-white shadow-sm">
        <div className="flex items-center gap-1 text-[#67707E]">
          <MapPin size={16} />
          <span className="text-sm font-medium">
            Ikeja, Lagos, Nigeria
          </span>
          <ChevronDown size={16} />
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/dashboard/notification"
            className="relative p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <Bell size={18} className="text-[#67707E]" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full" />
          </Link>

          <Link
            to="/dashboard/settings"
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <Settings size={18} className="text-[#67707E]" />
          </Link>
        </div>
      </div>

      {/* Page Title */}
      <div className="flex items-center justify-between px-4 md:px-6 py-4">
        <div>
          <h2 className="text-base sm:text-lg font-semibold text-gray-800">
            Analytics
          </h2>
          <p className="text-xs sm:text-sm text-gray-500">
            Track your savings and activity
          </p>
        </div>

        <button className="flex items-center gap-1 px-3 py-2 border border-gray-300 text-sm rounded-md hover:bg-gray-50 transition">
          This month
          <ChevronDown size={16} />
        </button>
      </div>

      {/* Search & Filter */}
      <div className="flex items-center justify-end gap-2 px-4 md:px-6">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search for your splitz..."
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
          />
        </div>

        <button
          className="h-10 w-10 flex items-center justify-center border border-gray-300 rounded-lg text-[#67707E] hover:bg-green-600 hover:text-white hover:border-green-600 transition"
          aria-label="Filter"
        >
          <ListFilter size={18} />
        </button>
      </div>

      {/* Table Header */}
      <div className="px-4 md:px-6 mt-6">
        <table className="w-full border-collapse">
          <thead >
            <tr className="bg-[#D0C9D6] text-white text-sm py-5">
              <th className="py-3 px-2 text-left">Splitz name</th>
              <th className="py-3 px-2 text-left">Role</th>
              <th className="py-3 px-2 text-left">Status</th>
              <th className="py-3 px-2 text-left">Progress</th>
              <th className="py-3 px-2 text-left">Action</th>
            </tr>
          </thead>
        </table>
      </div>

      {/* Empty State */}
      <div className="flex flex-1 items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <img
            src={screen}
            alt="analytics"
            className="mx-auto max-h-48 object-contain"
          />

          <h1 className="mt-4 font-semibold text-lg text-[#67707E]">
            Your analytics will appear here
          </h1>
          <p className="mt-2 text-sm text-[#A3A9B2]">
            Join or create a split to start tracking your savings and
            activity.
          </p>

          <div className="mt-6 flex flex-col gap-3">
            <button
              onClick={goCreateSplitz}
              className="w-full bg-[#1F8225] text-white py-2.5 rounded-lg text-sm font-medium hover:bg-green-700 transition active:scale-95"
            >
              Create a splitz
            </button>

            <button className="w-full border border-green-600 text-green-700 py-2.5 rounded-lg text-sm font-medium hover:bg-green-50 transition active:scale-95">
              Join Splitz
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MySplitz;
