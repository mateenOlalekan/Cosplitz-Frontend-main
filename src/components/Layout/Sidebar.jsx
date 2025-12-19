import { NavLink } from "react-router-dom";
import {
  Home,
  Share2,
  MessageSquare,
  Wallet,
  MapPin,
  BarChart3,
  X,
} from "lucide-react";

import logo from "../../assets/logo.svg";
import userImg from "../../assets/user.svg";

const Sidebar = ({ sidebarOpen, isMobile, setSidebarOpen }) => {
  const handleOverlayClick = () => {
    if (isMobile) setSidebarOpen(false);
  };

  // User navigation links (MATCHES App.js ROUTES)
  const navItems = [
    { icon: Home, label: "Home", url: "/dashboard" },
    { icon: Share2, label: "My Splitz", url: "/dashboard/mysplitz", count: 3 },
    { icon: MessageSquare, label: "Messages", url: "/dashboard/messages", count: 8 },
    { icon: Wallet, label: "Wallet", url: "/dashboard/wallet" },
    { icon: MapPin, label: "Nearby", url: "/dashboard/filter", count: 12 },
    { icon: BarChart3, label: "Analytics", url: "/dashboard/analytics" },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && isMobile && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={handleOverlayClick}
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-full bg-white border-r border-gray-200 z-50
        w-60
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0 lg:static lg:z-auto
        transition-transform duration-500`}
      >
        <div className="px-4 py-3 h-full flex flex-col relative">
          {/* Close button (mobile) */}
          {isMobile && (
            <button
              onClick={() => setSidebarOpen(false)}
              className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-lg"
            >
              <X size={20} />
            </button>
          )}

          {/* Logo */}
          <div className="mb-8">
            <img src={logo} alt="Logo" className="h-10 w-auto" />
          </div>

          {/* Navigation */}
          <nav className="space-y-1 flex-1">
            {navItems.map((item, i) => (
              <NavLink
                key={i}
                to={item.url}
                end={item.url === "/dashboard"}
                onClick={() => isMobile && setSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center justify-between p-2 rounded-lg transition-all
                  ${
                    isActive
                      ? "bg-green-600 text-white shadow"
                      : "text-gray-700 hover:bg-gray-100"
                  }`
                }
              >
                <div className="flex items-center gap-2">
                  <item.icon size={20} />
                  <span className="text-sm font-medium">{item.label}</span>
                </div>

                {item.count && (
                  <span className="text-xs bg-gray-200 px-2 py-1 rounded-full">
                    {item.count}
                  </span>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Community card */}
          <div className="mt-4 p-3 bg-green-700 rounded-xl text-white">
            <h3 className="text-sm font-bold mb-1">Community Bonding</h3>
            <p className="text-xs">Level 4</p>
            <p className="text-xs mb-2">23 completed split</p>
            <div className="w-full h-2 bg-green-900/40 rounded">
              <div className="h-full w-3/4 bg-white rounded" />
            </div>
            <p className="text-xs mt-2">Reliability Score: 87%</p>
          </div>

          {/* User */}
          <div className="mt-4 flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg">
            <img
              src={userImg}
              alt="Profile"
              className="w-10 h-10 rounded-full"
            />
            <div className="min-w-0">
              <p className="text-sm font-semibold truncate">ddwdwdwdd</p>
              <p className="text-xs text-gray-500 truncate">user email</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
