// Logo.jsx
import NavbarLogo from "../../assets/logo.svg"; // Path to your logo
function Logo() {
  return (
    <img
      src={NavbarLogo}
      alt="Logo"
      className="sm:w-10 sm:h-10 md:w-20 md:h-20 lg:w-30 lg:h-30 select-none pointer-events-none"
      draggable="false"
    />
  );
}

export default Logo;
