import React from 'react';
import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom';
import { X, User, Bell, Shield, Headphones, LogOut, Trash2, ArrowLeft } from 'lucide-react';

const settingsMenu = [
  { id: 'profile', icon: User, label: 'My Profile', path: '/dashboard/settings/profile' },
  { id: 'notifications', icon: Bell, label: 'Notifications', path: '/dashboard/settings/notifications' },
  { id: 'verification', icon: Shield, label: 'Verification status', path: '/dashboard/settings/verification' },
  { id: 'support', icon: Headphones, label: 'Support', path: '/dashboard/settings/support' },
];

export default function SettingsLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  const isActiveMenu = (menuPath) => {
    return (
      location.pathname === menuPath ||
      (menuPath === '/dashboard/settings/profile' &&
        location.pathname === '/dashboard/settings')
    );
  };



  return (
    <div className="min-h-screen">
      {/* Main Content */}
      <div className="w-full">
        <div className="p-1 sm:px-0">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-2">

            {/* SIDEBAR — NOW STICKY */}
            <div className="md:col-span-1 h-full sticky bg-[#F7F5F9] top-0 p-2">
              <div className="rounded-lg shadow-sm bg-white   p-4">

                {/* Settings Menu */}
                <nav className="space-y-2">
                  {settingsMenu.map((item) => (
                    <Link
                      key={item.id}
                      to={item.path}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                        isActiveMenu(item.path)
                          ? 'bg-green-100 text-green-700 border border-green-200'
                          : 'text-gray-700 hover:bg-gray-100 border border-transparent'
                      }`}
                    >
                      <item.icon size={20} />
                      <span className="text-sm font-medium text-left">{item.label}</span>
                    </Link>
                  ))}
                </nav>

                {/* Logout & Delete */}
                <div className="space-y-2 mt-6 pt-6 border-t border-gray-200">
                  <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-all duration-200 border border-transparent hover:border-gray-200">
                    <LogOut size={20} />
                    <span className="text-sm font-medium">Log out</span>
                  </button>
                  <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-all duration-200 border border-transparent hover:border-red-200">
                    <Trash2 size={20} />
                    <span className="text-sm font-medium">Delete account</span>
                  </button>
                </div>

              </div>
            </div>

            {/* SETTINGS CONTENT */}
            <div className="md:col-span-3">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <Outlet />
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
