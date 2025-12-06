import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../../components/Layout/Sidebar";
import Header from "../../components/Layout/DashHeader";

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect screen size
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    handleResize(); // Initial check
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex min-h-screen h-screen w-full  overflow-hidden">
      {/* Sidebar */}
      <Sidebar
        sidebarOpen={sidebarOpen}
        isMobile={isMobile}
        setSidebarOpen={setSidebarOpen}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-y-auto">
        {/* Header */}
        <Header
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          isMobile={isMobile}
        />

        {/* Outlet renders nested dashboard pages */}
        <main className="flex-1 overflow-y-auto  bg-white">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
