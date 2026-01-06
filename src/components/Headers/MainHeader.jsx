import { Menu} from "lucide-react";
import {Bell,Settings,MapPin,ChevronDown} from "lucide-react";
import { Link } from "react-router-dom";
import logo from "../../assets/logo.svg";

function Header({ setSidebarOpen, sidebarOpen, isMobile }) {
  return (
    <header className="sticky top-0 bg-white border-b border-gray-200 z-30">
      
      {/* ====== Mobile Top Bar ====== */}
      {isMobile ? (
        <div className="px-4 py-2.5">
          {/* Logo and Menu Row */}
          <div className="flex items-center justify-between mb-2">
            {/* Logo */}
            <img
              src={logo}
              alt="Logo"
              className="h-7 w-auto"
            />

            {/* Menu Button */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Toggle sidebar"
            >
              <Menu size={20} />
            </button>
          </div>
        </div>
      ) : ("")}
      <div className="w-full flex justify-between items-center">
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
    </header>
  );
}

export default Header;