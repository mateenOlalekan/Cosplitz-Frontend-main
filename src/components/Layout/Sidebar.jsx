// src/components/Layout/Sidebar.jsx
import { NavLink } from "react-router-dom";
import {  Home,  Share2,  MessageSquare,  Wallet,  MapPin,  BarChart3,  X,} from "lucide-react";
import logo from "../../assets/logo.svg";
import user from "../../assets/user.svg";

const Sidebar = ({ sidebarOpen, isMobile, setSidebarOpen }) => {
  const handleOverlayClick = () => {
    if (isMobile) setSidebarOpen(false);
  };

  const navItems = [
    { icon: Home, label: "Home", url: "/dashboard" },
    { icon: Share2, label: "My Splitz", url: "/dashboard/create-split", count: 3 },
    { icon: MessageSquare, label: "Messages", url: "/dashboard/messages", count: 8 },
    { icon: Wallet, label: "Wallet", url: "/dashboard/payment" },
    { icon: MapPin, label: "Nearby", url: "/dashboard/nearby", count: 12 },
    { icon: BarChart3, label: "Analytics", url: "/dashboard/analytics" },
  ];

  return (
    <>
      {/* Overlay for mobile */}
      {sidebarOpen && isMobile && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={handleOverlayClick}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full bg-white border-r border-gray-200 transition-transform duration-300 z-50
          ${isMobile ? "w-2/3" : "w-64"}
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 lg:static lg:z-auto`}
      >
        <div className="p-4 lg:p-6 h-full flex flex-col relative">
          {/* Close button (mobile only) */}
          {isMobile && (
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden absolute top-4 right-4 p-1 hover:bg-gray-100 rounded-lg"
            >
              <X size={20} />
            </button>
          )}

          {/* Logo */}
            <div className="w-full mb-4 flex justify-start">
              <img
                src={logo}
                alt="Logo"
                className="h-10 md:h-12 object-cover w-auto select-none pointer-events-none"
              />
            </div>

          {/* Navigation Links */}
          <nav className="space-y-1 flex-1">
            {navItems.map((item, i) => (
              <NavLink
                key={i}
                to={item.url}
                end
                onClick={() => isMobile && setSidebarOpen(false)}
                className={({ isActive }) =>
                  `w-full flex items-center justify-between p-2 rounded-lg transition-colors text-sm ${
                    isActive
                      ? "bg-green-600 text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`
                }
              >
                <div className="flex items-center gap-2">
                  <item.icon size={18} />
                  <span className="font-medium">{item.label}</span>
                </div>
                {item.count && (
                  <span className="text-xs bg-gray-200 px-2 py-0.5 rounded-full">
                    {item.count}
                  </span>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Community Bonding Card */}
          <div className="mt-6 p-4 bg-[#1F8225] rounded-xl text-white">
            <div className="flex items-center gap-1 mb-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="w-1 h-1 bg-white rounded-full" />
              ))}
            </div>
            <h3 className="font-bold text-sm mb-1">Community Bonding</h3>
            <p className="text-xs mb-1">Level 4</p>
            <p className="text-xs mb-2">23 completed split</p>
            <div className="w-full h-1 bg-green-700 rounded-full overflow-hidden">
              <div className="h-full w-3/4 bg-white" />
            </div>
            <p className="text-xs mt-2">Reliability Score: 87%</p>
          </div>

          {/* Profile */}
          <button className="w-full mt-6 flex items-center gap-3 py-2 hover:bg-gray-50 rounded-lg">
            <img
              src={user}
              alt="Profile"
              className="w-12 h-12 rounded-full"
            />
            <div className="text-left">
              <p className="text-sm font-semibold text-gray-900 truncate">
                Alice Badmus
              </p>
              <p className="text-xs text-gray-500 truncate">
                View Profile & Settings
              </p>
            </div>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
