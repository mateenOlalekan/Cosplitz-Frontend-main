import { useState, useMemo, useEffect } from "react";
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
  const user = useAuthStore((state) => state.user);
  const fetchUserInfo = useAuthStore((state) => state.fetchUserInfo);

  const [notifications] = useState({
    splits: 3,
    messages: 8,
    wallet: 12,
  });

  /* ======================
     USER ROLE
  ======================= */
  const role = user?.role || "user";

  // ✅ Prevent repeated calls
  useEffect(() => {
    if (!user) {
      fetchUserInfo();
    }
  }, [user]); // intentionally omit fetchUserInfo

  const navItems = useMemo(() => {
    const common = [
      { icon: Home, 
        label: "Home", 
        url: "/dashboard", 
        count: null 
      },
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
      { icon: MapPin, 
        label: "Nearby", 
        url: "/dashboard/filter", 
        count: null },
      {
        icon: BarChart3,
        label: "Analytics",
        url: "/dashboard/analytics",
        count: null,
      },
    ];

    const adminOnly = [
      {
        icon: BarChart3,
        label: "Overview",
        url: "/dashboard/overview",
        count: null,
      },
      {
        icon: BarChart3,
        label: "AllSplitz",
        url: "/dashboard/allsplitz",
        count: null,
      },
      {
        icon: BarChart3,
        label: "SplitzAnalytics",
        url: "/dashboard/splitanalytics",
        count: null,
      },
      {
        icon: BarChart3,
        label: "Message",
        url: "/dashboard/splitzmessage",
        count: null,
      },
      {
        icon: BarChart3,
        label: "KYC Verification",
        url: "/dashboard/Kyc verification",
        count: null,
      },
    ];

    return role === "admin" ? [...common, ...adminOnly] : common;
  }, [
    role,
    notifications.splits,
    notifications.messages,
    notifications.wallet,
  ]);

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
      {/* Mobile Overlay */}
      {sidebarOpen && isMobile && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-68 bg-white border-r border-gray-200 z-50
          flex flex-col
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 lg:static
          transition-transform duration-300 ease-in-out
        `}
      >
        {/* Logo */}
        <div className="px-6 py-5">
          <img src={logo} alt="App logo" className="h-8" />
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 overflow-y-auto">
          <div className="space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.url}
                to={item.url}
                end={item.url === "/dashboard"}
                onClick={() => isMobile && setSidebarOpen(false)}
                className={({ isActive }) => `
                  flex items-center justify-between
                  px-4 py-2.5 rounded-xl
                  transition-all duration-200
                  ${
                    isActive
                      ? "bg-[#1F8225] text-white"
                      : "text-gray-700 hover:bg-gray-50"
                  }
                `}
              >
                <div className="flex items-center gap-3">
                  <item.icon size={20} />
                  <span className="text-sm font-medium">
                    {item.label}
                  </span>
                </div>

                {item.count !== null && (
                  <span className="text-xs font-semibold px-2 py-1 rounded-full bg-gray-100 text-gray-700">
                    {item.count}
                  </span>
                )}
              </NavLink>
            ))}
          </div>

          {/* Community Standing */}
          <div className="mt-6 p-4 bg-[#1F8225] rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold text-white leading-tight">
                Community <br /> Standing
              </h3>

              <div className="flex gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-white" />
                <span className="w-2.5 h-2.5 rounded-full bg-white" />
                <span className="w-2.5 h-2.5 rounded-full bg-white" />
                <span className="w-2.5 h-2.5 rounded-full bg-white/30" />
              </div>
            </div>

            <p className="text-sm font-bold text-white">
              Level {userStats.level}
            </p>

            <div className="text-sm text-white space-y-1">
              <p>23 Completed Splits</p>
              <p>Reliability Score: 87%</p>
            </div>

            <div className="h-2 bg-white/20 rounded-full overflow-hidden">
              <div className="h-full bg-white w-3/4 rounded-full" />
            </div>
          </div>
        </nav>

        {/* User Profile */}
        <div className="px-4 py-4 border-t border-gray-100">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition">
            <img
              src={userStats.avatar || userImg}
              alt="User avatar"
              className="w-10 h-10 rounded-full"
            />

            <div className="leading-tight">
              <h4 className="text-sm font-semibold text-gray-900">
                {userStats.name}
              </h4>
              <p className="text-xs text-gray-500">
                {userStats.email}
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
