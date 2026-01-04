import { useEffect, useMemo, useState } from "react";
import { NavLink } from "react-router-dom";
import {
  Home,
  Share2,
  MessageSquare,
  Wallet,
  MapPin,
  BarChart3,
} from "lucide-react";

import logo from "../../assets/logo.svg";
import userImg from "../../assets/user.svg";
import useAuthStore from "../../store/authStore";

const Sidebar = ({ sidebarOpen, isMobile, setSidebarOpen }) => {
  const { user, fetchUserInfo } = useAuthStore();

  useEffect(() => {
    if (!user) fetchUserInfo();
  }, [user, fetchUserInfo]);

  /* ======================
     USER ROLE
  ======================= */
  const role = user?.role || "user";

  /* ======================
     NOTIFICATIONS (STATIC)
  ======================= */
  const [notifications] = useState({
    splits: 3,
    messages: 8,
    wallet: 12,
  });

  /* ======================
     NAV ITEMS BY ROLE
  ======================= */
  const navItems = useMemo(() => {
    const common = [
      { icon: Home, label: "Home", url: "/dashboard" },
      {
        icon: Share2,
        label: "My Splits",
        url: "/dashboard/mysplitz",
        count: notifications.splits,
      },
      {
        icon: MessageSquare,
        label: "Messages",
        url: "/dashboard/messages",
        count: notifications.messages,
      },
      {
        icon: Wallet,
        label: "Wallet",
        url: "/dashboard/wallet",
        count: notifications.wallet,
      },
      {
        icon: MapPin,
        label: "Nearby",
        url: "/dashboard/filter",
      },
    ];

    const adminOnly = [
      {
        icon: BarChart3,
        label: "Analytics",
        url: "/dashboard/analytics",
      },
    ];

    return role === "admin" ? [...common, ...adminOnly] : common;
  }, [role, notifications]);

  /* ======================
     USER SAFE DATA
  ======================= */
  const userStats = {
    level: user?.level || 1,
    name:
      user?.full_name ||
      `${user?.first_name || ""} ${user?.last_name || ""}`.trim() ||
      "User",
    email: user?.email || "",
    avatar: user?.avatar || null,
  };

  return (
    <>
      {sidebarOpen && isMobile && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 h-full w-64 bg-white border-r z-50
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 lg:static
          transition-transform duration-300
        `}
      >
        {/* Logo */}
        <div className="px-6 py-5">
          <img src={logo} alt="Logo" className="h-8" />
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.url}
              to={item.url}
              onClick={() => isMobile && setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center justify-between px-4 py-2.5 rounded-xl ${
                  isActive
                    ? "bg-[#1F8225] text-white"
                    : "text-gray-700 hover:bg-gray-50"
                }`
              }
            >
              <div className="flex items-center gap-3">
                <item.icon size={20} />
                <span className="text-sm font-medium">{item.label}</span>
              </div>

              {item.count !== undefined && (
                <span className="text-xs px-2 py-1 bg-gray-100 rounded-full">
                  {item.count}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Profile */}
        <div className="px-4 py-4 border-t">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50">
            <img
              src={userStats.avatar || userImg}
              className="w-10 h-10 rounded-full"
            />
            <div>
              <p className="text-sm font-semibold">{userStats.name}</p>
              <p className="text-xs text-gray-500">{userStats.email}</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
