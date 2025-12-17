import { NavLink } from "react-router-dom";
import {  User,  Bell,  Shield,  Headphones,Lock,ChevronLeft,LogOut,} from "lucide-react";
import { Trash2 } from "lucide-react";
import { IoLogOutOutline } from "react-icons/io5";

const links = [
  { icon: User, label: "My Profile", path: "/dashboard/settings/profile" },
  { icon: Bell, label: "Notifications", path: "/dashboard/settings/notifications" },
  { icon: Shield, label: "Verification Status", path: "/dashboard/settings/verification" },
  { icon: Lock, label: "Reset Password", path: "/dashboard/settings/resetpassword" },
  { icon: Headphones, label: "Support", path: "/dashboard/settings/support" },
];

export default function Sidebar({onLogout, onDelete}) {
  return (
    <aside className="bg-white p-2 rounded-lg">
      <div className="h-full flex flex-col   bg-[#F7F5F9] p-3 rounded-lg">
        
        {/* ===== TOP SECTION ===== */}
        <div>
          {/* Header */}
          <div className="mb-4">
            <div className="flex items-center gap-2">
              <ChevronLeft className="cursor-pointer" size={16} />
              <h2 className="text-lg font-semibold">Settings</h2>
            </div>
            <p className="mt-1 text-xs text-gray-500">
              You can find all settings here
            </p>
          </div>

          {/* Navigation */}
          <nav className="space-y-2">
            {links.map(({ icon: Icon, label, path }) => (
              <NavLink
                key={path}
                to={path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-2 rounded-lg text-xs font-medium transition
                  ${
                    isActive
                      ? "bg-green-100 text-green-700 border border-green-200"
                      : "text-gray-700 hover:bg-gray-100"
                  }`
                }
              >
                <Icon size={14} />
                {label}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* ===== BOTTOM SECTION ===== */}
        <div className="mt-auto pt-6 space-y-3">
          
          {/* Logout */}
          <button onClick={onLogout} className="flex items-center gap-3 w-full px-4 py-2 rounded-lg hover:bg-gray-50 transition">
            <div className="w-6 h-6 flex items-center justify-center rounded-full bg-[#65CADF80]">
              <IoLogOutOutline size={14} className="text-[#67707E]" />
            </div>
            <span className="text-sm font-medium text-[#67707E]">
              Logout
            </span>
          </button>

          {/* Delete Account */}
          <button onClick={onDelete} className="flex items-center gap-3 w-full px-4 py-2 rounded-lg hover:bg-red-50 transition">
            <div className="w-6 h-6 flex items-center justify-center rounded-full bg-[#FDD3D0]">
              <Trash2 size={14} className="text-[#E60000]" />
            </div>
            <span className="text-sm font-medium text-[#E60000]">
              Delete Account
            </span>
          </button>
        </div>

      </div>
    </aside>
  );
}
