// src/components/Layout/Header.jsx
import { Menu, Bell, Settings, ListFilter, Search } from "lucide-react";
import { Link } from "react-router-dom";

function Header({ setSidebarOpen, sidebarOpen, isMobile }) {
  return (
    <header className="sticky top-0 bg-white border-b border-gray-200 z-30">
      
      {/* ====== Top Location Row ====== */}
      <div className="flex justify-between items-center px-4 py-2 gap-3">
        <div className="text-sm text-gray-600 text-center sm:text-left">
          Ikeja, Lagos, Nigeria
        </div>

        <div className="flex items-center justify-center sm:justify-end gap-3">
          {/* Notification Icon */}
          <Link
            to="/dashboard/notification"
            className="relative p-2 hover:bg-gray-100 rounded-lg"
          >
            <Bell size={18} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
          </Link>

          {/* Settings Icon */}
          <Link
            to="/dashboard/settings"
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <Settings size={18} />
          </Link>
        </div>
      </div>

      {/* ====== Search + Menu Row ====== */}
      <div className="px-4 pt-2 pb-3 flex items-center justify-between gap-3">
        
        {/* Left Section */}
        <div className="flex items-center gap-3 flex-1">
          
          {/* Sidebar Button: only visible on mobile */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-gray-100 rounded-lg lg:hidden"
            aria-label="Toggle sidebar"
          >
            <Menu size={20} />
          </button>

          {/* Search Input Container */}
          <div className="flex items-center gap-2 flex-1 px-3 py-2  rounded-lg border border-gray-300">
            <Search size={18} className="text-gray-600" />
            <input
              type="text"
              placeholder="Find Splittz nearby: Taxi, Groceries, Tools..."
              className="flex-1 bg-transparent outline-none text-sm"
            />
          </div>
        </div>

        {/* Right Section */}
        <button className="p-2  text-[#67707E] border-[1px] border-[#67707E] rounded-lg hover:bg-green-600 hover:text-white hover:border-none">
          <ListFilter size={20} />
        </button>
      </div>
    </header>
  );
}

export default Header;
