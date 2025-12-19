import { NavLink } from "react-router-dom";
import {
  Home,
  Share2,
  MessageSquare,
  Wallet,
  MapPin,
  BarChart3,
  X,
  LogOut,
} from "lucide-react";

import logo from "../../assets/logo.svg";
import userImg from "../../assets/user.svg";

const Sidebar = ({ sidebarOpen, isMobile, setSidebarOpen }) => {
  const handleOverlayClick = () => {
    if (isMobile) setSidebarOpen(false);
  };

  // User navigation links only
  const navItems = [
    { icon: Home, label: "Home", url: "/dashboard" },
    { icon: Share2, label: "My Splitz", url: "/dashboard/mysplitz", count: 3 },
    { icon: MessageSquare, label: "Messages", url: "/dashboard/messages", count: 8 },
    { icon: Wallet, label: "Wallet", url: "/dashboard/wallet" },
    { icon: MapPin, label: "Nearby", url: "/dashboard/nearby", count: 12 },
    { icon: BarChart3, label: "Analytics", url: "/dashboard/analytics" },
  ];

  return (
    <>
      {/* Mobile overlay with smooth fade */}
      {sidebarOpen && isMobile && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden transition-opacity duration-300 ease-in-out"
          onClick={handleOverlayClick}
        />
      )}

      {/* Sidebar with smooth animation */}
      <aside
        className={`fixed top-0 left-0 h-full bg-white border-r border-gray-200 z-50
        ${isMobile ? "w-60" : "w-60"}
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0 lg:static lg:z-auto
        transition-all duration-700 ease-in-out`}
      >
        <div className="px-4 py-3 h-full flex flex-col relative">
          {/* Close btn (mobile only) */}
          {isMobile && (
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-lg transition-colors duration-300"
            >
              <X size={20} />
            </button>
          )}

          {/* Logo */}
          <div className="w-full mb-8 flex justify-start">
            <img
              src={logo}
              alt="Logo"
              className="h-10 object-cover w-auto select-none pointer-events-none"
            />
          </div>

          {/* Navigation with staggered animation */}
          <nav className="space-y-1 flex-1">
            {navItems.map((item, i) => (
              <NavLink
                key={i}
                to={item.url}
                end
                onClick={() => isMobile && setSidebarOpen(false)}
                className={({ isActive }) =>
                  `w-full flex items-center justify-between p-2 rounded-lg transition-all duration-300
                  ${isActive
                    ? "bg-green-600 text-white shadow-md"
                    : "text-gray-700 hover:bg-gray-100 hover:shadow-sm"
                  }`
                }
              >
                <div className="flex items-center gap-2">
                  <item.icon size={20} className="transition-transform duration-300" />
                  <span className="font-medium text-sm">{item.label}</span>
                </div>

                {item.count && (
                  <span className="text-xs bg-gray-200 px-2 py-1 rounded-full min-w-[24px] text-center transition-all duration-300">
                    {item.count}
                  </span>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Community Card with animation */}
          <div className="mt-4 p-3 bg-[#1F8225] rounded-xl text-white shadow-lg">
            <div className="flex items-center gap-1 mb-2">
              {[...Array(5)].map((_, i) => (
                <div 
                  key={i} 
                  className="w-1 h-1 bg-white rounded-full"
                />
              ))}
            </div>

            <h3 className="font-bold text-sm mb-2">Community Bonding</h3>
            <p className="text-xs mb-2">Level 4</p>
            <p className="text-xs mb-3">23 completed split</p>

            <div className="w-full h-2 bg-green-800/50 rounded-full overflow-hidden mb-2">
              <div className="h-full w-3/4 bg-white rounded-full" />
            </div>

            <p className="text-xs mt-2">Reliability Score: 87%</p>
          </div>

          {/* Logged-in User */}
          <div className="mt-4">
            <div className="w-full flex items-center gap-3 py-3 px-2 cursor-pointer hover:bg-gray-50 rounded-lg transition-all duration-300">
              <img
                src={userImg}
                alt="Profile"
                className="w-12 h-12 rounded-full border-2 border-gray-200 transition-all duration-300"
              />

              <div className="text-left flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">
                  ddwdwdwdd
                </p>
                <p className="text-xs text-gray-500 truncate">
                  user email
                </p>
              </div>
            </div>


          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;