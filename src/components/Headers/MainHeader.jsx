import { Menu} from "lucide-react";
import {useNavigate } from "react-router-dom";
import logo from "../../assets/logo.svg";

function Header({ setSidebarOpen, sidebarOpen, isMobile }) {
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
        </div>
      ) : ("")}
    </header>
  );
}

export default Header;