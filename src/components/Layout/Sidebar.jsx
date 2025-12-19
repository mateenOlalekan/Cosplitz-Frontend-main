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
  const navItems = [
    { icon: Home, label: "Home", url: "/dashboard" },
    { icon: Share2, label: "My Splitz", url: "/dashboard/mysplitz" },
    { icon: MessageSquare, label: "Messages", url: "/dashboard/messages" },
    { icon: Wallet, label: "Wallet", url: "/dashboard/wallet" },
    { icon: MapPin, label: "Nearby", url: "/dashboard/filter" },
    { icon: BarChart3, label: "Analytics", url: "/dashboard/analytics" },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && isMobile && (
        <div
          className="fixed inset-0 bg-black/40 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-full w-60 bg-white border-r z-50
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0 lg:static transition-transform`}
      >
        <div className="h-full flex flex-col p-4">

          {/* Mobile close */}
          {isMobile && (
            <button
              onClick={() => setSidebarOpen(false)}
              className="absolute top-4 right-4"
            >
              <X />
            </button>
          )}

          {/* Logo */}
          <img src={logo} alt="Logo" className="h-10 mb-8" />

          {/* Nav */}
          <nav className="flex-1 space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.url}
                to={item.url}
                end={item.url === "/dashboard"}
                className={({ isActive }) =>
                  `flex items-center gap-3 p-2 rounded-lg
                  ${isActive ? "bg-green-600 text-white" : "text-gray-700 hover:bg-gray-100"}`
                }
                onClick={() => isMobile && setSidebarOpen(false)}
              >
                <item.icon size={18} />
                <span className="text-sm">{item.label}</span>
              </NavLink>
            ))}
          </nav>

          {/* User */}
          <div className="flex items-center gap-3 mt-4">
            <img src={userImg} className="w-10 h-10 rounded-full" />
            <div>
              <p className="text-sm font-semibold">User</p>
              <p className="text-xs text-gray-500">user@email.com</p>
            </div>
          </div>

        </div>
      </aside>
    </>
  );
};

export default Sidebar;
