import {Bell,Settings,MapPin,ChevronDown} from "lucide-react";
import { Link } from "react-router-dom";

function SelectedHeader() {
  return (
      <div className="w-full flex items-center justify-between py-3  bg-white shadow-sm">
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
  )
}

export default SelectedHeader