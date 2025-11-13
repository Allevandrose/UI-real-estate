import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { logout } from "../store/authSlice";

// Import Remix icons from "@remixicon/react"
import {
  RiHome4Line, // Dashboard
  RiAddBoxLine, // Add Property
  RiBuildingLine, // All Properties
  RiArrowLeftSLine, // Collapse
  RiArrowRightSLine, // Expand
  RiLogoutBoxLine, // Logout
  RiMenuLine, // Mobile Menu
  RiCloseLine, // Close Menu
} from "@remixicon/react";

const AdminSidebar = () => {
  const { token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState("");
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  // Check if a link is active
  const isActive = (path) => {
    if (path === "/admin" && location.pathname === "/admin") return true;
    if (path !== "/admin" && location.pathname.startsWith(path)) return true;
    return false;
  };

  // Update tooltip position based on mouse movement
  const handleMouseEnter = (label, event) => {
    if (isCollapsed) {
      const rect = event.currentTarget.getBoundingClientRect();
      setTooltipPosition({
        x: rect.right + 10, // Position to the right of the icon
        y: rect.top + rect.height / 2, // Center vertically
      });
      setShowTooltip(label);
    }
  };

  // Navigation items
  const navItems = [
    {
      to: "/admin",
      icon: RiHome4Line,
      label: "Dashboard",
    },
    {
      to: "/admin/properties/new",
      icon: RiAddBoxLine,
      label: "Add Property",
    },
    {
      to: "/admin/properties",
      icon: RiBuildingLine,
      label: "All Properties",
    },
  ];

  return (
    <>
      {/* Mobile Menu Button - Fixed at top */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-30 w-10 h-10 rounded-lg flex items-center justify-center bg-blue-700 text-white shadow-lg hover:bg-blue-800 transition-colors duration-200"
        aria-label="Toggle menu"
      >
        {isMobileMenuOpen ? (
          <RiCloseLine className="text-xl" />
        ) : (
          <RiMenuLine className="text-xl" />
        )}
      </button>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-20 transition-opacity duration-300"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Global Tooltip - Positioned independently from sidebar */}
      {isCollapsed && showTooltip && (
        <div
          className="fixed bg-gray-900 text-white text-sm px-3 py-2 rounded-lg shadow-xl whitespace-nowrap z-50 pointer-events-none transition-opacity duration-200"
          style={{
            left: `${tooltipPosition.x}px`,
            top: `${tooltipPosition.y}px`,
            transform: "translateY(-50%)",
          }}
        >
          {showTooltip}
          {/* Tooltip arrow */}
          <div
            className="absolute right-full top-1/2 transform -translate-y-1/2 border-8 border-transparent border-r-gray-900"
            style={{ marginTop: "-8px" }}
          ></div>
        </div>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 bg-white shadow-xl transition-all duration-500 ease-in-out z-20
          ${isCollapsed ? "w-20" : "w-72"}
          ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
        `}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div
            className={`flex items-center p-4 sm:p-5 border-b border-gray-100 ${
              isCollapsed ? "justify-center" : "justify-between"
            }`}
          >
            {!isCollapsed && (
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg transform transition-transform duration-300 hover:scale-105">
                  <span className="text-white font-bold text-2xl leading-none">
                    H
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xl font-bold text-gray-900">
                    Home254
                  </span>
                  <span className="text-xs text-gray-500 font-medium">
                    Admin Panel
                  </span>
                </div>
              </div>
            )}
            {isCollapsed && (
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg transform transition-transform duration-300 hover:scale-105">
                <span className="text-white font-bold text-2xl leading-none">
                  H
                </span>
              </div>
            )}
            {!isCollapsed && (
              <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="hidden lg:flex w-8 h-8 rounded-lg items-center justify-center bg-gray-100 hover:bg-blue-50 hover:text-blue-700 text-gray-600 transition-all duration-300"
                aria-label="Collapse sidebar"
              >
                <RiArrowLeftSLine className="text-lg" />
              </button>
            )}
          </div>

          {/* Collapsed Toggle Button */}
          {isCollapsed && (
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="hidden lg:flex w-8 h-8 rounded-lg items-center justify-center bg-gray-100 hover:bg-blue-50 hover:text-blue-700 text-gray-600 transition-all duration-300 mx-auto mt-4"
              aria-label="Expand sidebar"
            >
              <RiArrowRightSLine className="text-lg" />
            </button>
          )}

          {/* Navigation Menu */}
          <nav className="flex-grow px-3 py-4 sm:py-6 space-y-2 overflow-y-auto">
            {navItems.map((item) => (
              <div key={item.to} className="relative">
                <Link
                  to={item.to}
                  onClick={() => setIsMobileMenuOpen(false)}
                  onMouseEnter={(e) => handleMouseEnter(item.label, e)}
                  onMouseLeave={() => setShowTooltip("")}
                  className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-300 group relative ${
                    isActive(item.to)
                      ? "bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-700"
                      : "hover:bg-blue-50"
                  } ${isCollapsed ? "justify-center" : ""}`}
                >
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-md transition-all duration-300 ${
                      isActive(item.to)
                        ? "bg-gradient-to-br from-blue-600 to-blue-700 shadow-lg transform scale-105"
                        : "bg-gradient-to-br from-blue-500 to-blue-600 group-hover:shadow-lg group-hover:scale-105"
                    }`}
                  >
                    <item.icon className="text-xl text-white" />
                  </div>
                  {!isCollapsed && (
                    <span
                      className={`text-base font-medium transition-colors duration-300 ${
                        isActive(item.to)
                          ? "text-blue-700"
                          : "text-gray-700 group-hover:text-blue-700"
                      }`}
                    >
                      {item.label}
                    </span>
                  )}
                </Link>
              </div>
            ))}
          </nav>

          {/* Logout Button */}
          <div className="p-3 sm:p-4 border-t border-gray-100">
            {isCollapsed ? (
              <div className="relative flex justify-center">
                <button
                  onClick={handleLogout}
                  onMouseEnter={(e) => handleMouseEnter("Logout", e)}
                  onMouseLeave={() => setShowTooltip("")}
                  className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 flex items-center justify-center transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
                  aria-label="Logout"
                >
                  <RiLogoutBoxLine className="text-xl text-white" />
                </button>
              </div>
            ) : (
              <button
                onClick={handleLogout}
                className="w-full py-3 px-4 rounded-lg bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 transition-all duration-300 font-medium flex items-center justify-center gap-2 shadow-md hover:shadow-lg text-white text-base transform hover:scale-[1.02]"
              >
                <RiLogoutBoxLine className="text-xl" />
                <span>Logout</span>
              </button>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;
