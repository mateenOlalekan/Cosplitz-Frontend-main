import { useState, useEffect } from "react"; 
import { Link, useLocation, useNavigate } from "react-router-dom";
import NavbarLogo from "../../assets/logo.svg";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [menu, setMenu] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { title: "Home", to: "home" },
    { title: "How It Works", to: "works" },
    { title: "Features", to: "features" },
    { title: "Community", to: "community" },
  ];

  const toggleMenu = () => setMenu((prev) => !prev);

  // Close menu with ESC key
  useEffect(() => {
    const handleEsc = (e) => e.key === "Escape" && setMenu(false);
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  // Navbar shadow on scroll
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Disable background scrolling when menu opens
  useEffect(() => {
    document.body.style.overflow = menu ? "hidden" : "auto";
    return () => (document.body.style.overflow = "auto");
  }, [menu]);

  // Smooth scroll behavior
  const handleNavClick = (id) => {
    setMenu(false);

    if (location.pathname !== "/") {
      navigate(`/#${id}`);
      return;
    }

    const section = document.getElementById(id);
    if (section) section.scrollIntoView({ behavior: "smooth" });
  };

  const handleSignupClick = () => {
    setMenu(false);
    navigate("/register");
  };

  const handleLoginClick = () => {
    setMenu(false);
    navigate("/login");
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-[9999] bg-white transition-all duration-300 ${
          isScrolled ? "shadow-lg" : "shadow-sm"
        }`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          {/* Logo */}
          <Link
            to="/"
            aria-label="CoSplitz home"
            className="flex items-center flex-shrink-0"
            onClick={() => setMenu(false)}
          >
            <img
              src={NavbarLogo}
              alt="CoSplitz logo"
              className="w-32 sm:w-36 md:w-40 lg:w-44 select-none pointer-events-none"
            />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8 xl:gap-10">
            {navItems.map((item) => (
              <button
                key={item.to}
                onClick={() => handleNavClick(item.to)}
                className="text-gray-800 hover:text-green-700 transition-colors text-[17px] font-semibold whitespace-nowrap relative group"
              >
                {item.title}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-600 transition-all duration-300 group-hover:w-full"></span>
              </button>
            ))}
          </nav>

          {/* Desktop Buttons */}
          <div className="hidden lg:flex items-center gap-5">
            <button
              onClick={handleLoginClick}
              className="px-6 py-2.5 rounded-md text-gray-700 hover:text-green-700 hover:bg-green-50 transition-colors font-semibold text-[16px]"
            >
              LOG IN
            </button>

            <button
              onClick={handleSignupClick}
              className="px-6 py-2.5 rounded-md bg-green-600 hover:bg-green-700 text-white transition-all font-semibold text-[16px] shadow-md hover:shadow-lg"
            >
              SIGN UP
            </button>
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={toggleMenu}
            aria-label={menu ? "Close menu" : "Open menu"}
            className="lg:hidden p-2.5 rounded-lg text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors"
          >
            {menu ? <X size={28} strokeWidth={2.5} /> : <Menu size={28} strokeWidth={2.5} />}
          </button>
        </div>

        {/* Overlay */}
        <div
          className={`fixed inset-0 bg-black/70 transition-opacity duration-300 lg:hidden ${
            menu ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          }`}
          onClick={() => setMenu(false)}
        />

        {/* Mobile Drawer */}
        <div
          className={`fixed top-0 right-0 h-full w-full max-w-sm bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-[10000] lg:hidden ${
            menu ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200 bg-white">
            <img 
              src={NavbarLogo} 
              alt="CoSplitz" 
              className="h-10" 
            />
            <button 
              onClick={toggleMenu} 
              className="p-2.5 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Close menu"
            >
              <X size={24} strokeWidth={2.5} />
            </button>
          </div>

          <nav className="flex flex-col px-6 py-8 space-y-1">
            {navItems.map((item) => (
              <button
                key={item.to}
                onClick={() => handleNavClick(item.to)}
                className="text-lg font-semibold text-gray-800 hover:text-green-700 hover:bg-green-50 transition-colors text-left py-4 px-4 rounded-lg"
              >
                {item.title}
              </button>
            ))}
          </nav>

          <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-200 bg-white">
            <div className="flex flex-col gap-4">
              <button
                onClick={handleLoginClick}
                className="w-full text-center px-5 py-3.5 rounded-lg text-gray-800 hover:text-green-700 hover:bg-green-50 font-semibold text-lg border border-gray-300 transition-colors"
              >
                LOG IN
              </button>

              <button
                onClick={handleSignupClick}
                className="w-full text-center px-5 py-3.5 rounded-lg bg-green-600 hover:bg-green-700 text-white font-semibold text-lg shadow-md hover:shadow-lg transition-all"
              >
                SIGN UP
              </button>
            </div>
          </div>
        </div>
      </header>
      
      {/* Spacer to prevent content from hiding behind fixed navbar */}
      <div className="h-16 sm:h-20"></div>
    </>
  );
}