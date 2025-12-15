import { Menu, Bell, Settings, ListFilter, Search } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/logo.svg";

function Header({ setSidebarOpen, sidebarOpen, isMobile }) {
  const navigate = useNavigate();

  const goFilterPage = () => {
    navigate("/dashboard/filter");
  }

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

          {/* Location and Icons Row */}
          <div className="flex items-center justify-between">
            {/* Location */}
            <div className="text-sm text-gray-600 font-medium">
              Ikeja, Lagos, Nigeria
            </div>

            {/* Icons */}
            <div className="flex items-center gap-1">
              {/* Notification Icon */}
              <Link
                to="/dashboard/notification"
                className="relative p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Bell size={18} />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              </Link>

              {/* Settings Icon */}
              <Link
                to="/dashboard/settings"
                className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Settings size={18} />
              </Link>
            </div>
          </div>
        </div>
      ) : (
        /* ====== Desktop Layout ====== */
        <>
          {/* Top Location and Icons Row */}
          <div className="flex justify-between items-center px-5 py-2.5">
            {/* Location */}
            <div className="text-sm text-gray-600 font-medium">
              Ikeja, Lagos, Nigeria
            </div>

            {/* Icons */}
            <div className="flex items-center gap-1">
              {/* Notification Icon */}
              <Link
                to="/dashboard/notification"
                className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Bell size={18} />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
              </Link>

              {/* Settings Icon */}
              <Link
                to="/dashboard/settings"
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Settings size={18} />
              </Link>
            </div>
          </div>
        </>
      )}

      {/* ====== Search Row ====== */}
      <div className={`px-4 ${isMobile ? 'pb-3 pt-1' : 'pb-3 pt-0'}`}>
        <div className="flex items-center gap-2">
          {/* Search Input */}
          <div className="flex items-center gap-2 flex-1 px-3 py-2.5 rounded-lg border border-gray-300 focus-within:border-green-500 focus-within:ring-1 focus-within:ring-green-500 transition-colors">
            <Search size={18} className="text-gray-500" />
            <input
              type="text"
              placeholder="Find Splittz nearby: Taxi, Groceries, Tools..."
              className="flex-1 bg-transparent outline-none text-sm placeholder:text-gray-400"
            />
          </div>

          {/* Filter Button */}
          <button 
            onClick={goFilterPage}
            className="p-2.5 text-[#67707E] border border-[#67707E] rounded-lg hover:bg-green-600 hover:text-white hover:border-green-600 transition-colors duration-200"
            aria-label="Filter options"
          >
            <ListFilter size={20} />
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;