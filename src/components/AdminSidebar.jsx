import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../store/authSlice";

// Import Remix icons from "@remixicon/react"
import {
  RiHome4Line, // Dashboard
  RiAddBoxLine, // Add Property
  RiBuildingLine, // All Properties
  RiArrowLeftSLine, // Collapse
  RiArrowRightSLine, // Expand
  RiLogoutBoxLine, // Logout
} from "@remixicon/react";

const AdminSidebar = () => {
  const { token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <aside
      className={`fixed inset-y-0 left-0 bg-white shadow-2xl transition-all duration-300 ease-in-out z-20 ${
        isCollapsed ? "w-20" : "w-72"
      }`}
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          {!isCollapsed && (
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-blue-700 rounded-lg flex items-center justify-center shadow-md">
                <span className="text-white font-bold text-xl">H</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold text-gray-900">Home254</span>
                <span className="text-xs text-gray-500 font-medium">
                  Admin Panel
                </span>
              </div>
            </div>
          )}
          {isCollapsed && (
            <div className="w-10 h-10 bg-blue-700 rounded-lg flex items-center justify-center shadow-md mx-auto">
              <span className="text-white font-bold text-xl">H</span>
            </div>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={`w-8 h-8 rounded-lg flex items-center justify-center bg-gray-100 hover:bg-blue-50 hover:text-blue-700 text-gray-600 transition-all duration-200 ${
              isCollapsed ? "hidden" : ""
            }`}
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? (
              <RiArrowRightSLine className="text-lg" />
            ) : (
              <RiArrowLeftSLine className="text-lg" />
            )}
          </button>
        </div>

        {/* Collapsed Toggle Button */}
        {isCollapsed && (
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="w-8 h-8 rounded-lg flex items-center justify-center bg-gray-100 hover:bg-blue-50 hover:text-blue-700 text-gray-600 transition-all duration-200 mx-auto mt-4"
            aria-label="Expand sidebar"
          >
            <RiArrowRightSLine className="text-lg" />
          </button>
        )}

        {/* Navigation Menu */}
        <nav className="flex-grow px-3 py-6 space-y-2 overflow-y-auto">
          <Link
            to="/admin"
            className={`flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-blue-50 transition-all duration-200 group ${
              isCollapsed ? "justify-center" : ""
            }`}
          >
            <div className="w-10 h-10 rounded-lg bg-blue-700 flex items-center justify-center shadow-md group-hover:shadow-lg group-hover:scale-105 transition-all duration-200">
              <RiHome4Line className="text-lg text-white" />
            </div>
            {!isCollapsed && (
              <span className="font-medium text-gray-700 group-hover:text-blue-700 transition-colors duration-200">
                Dashboard
              </span>
            )}
          </Link>

          <Link
            to="/admin/properties/new"
            className={`flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-blue-50 transition-all duration-200 group ${
              isCollapsed ? "justify-center" : ""
            }`}
          >
            <div className="w-10 h-10 rounded-lg bg-blue-700 flex items-center justify-center shadow-md group-hover:shadow-lg group-hover:scale-105 transition-all duration-200">
              <RiAddBoxLine className="text-lg text-white" />
            </div>
            {!isCollapsed && (
              <span className="font-medium text-gray-700 group-hover:text-blue-700 transition-colors duration-200">
                Add Property
              </span>
            )}
          </Link>

          <Link
            to="/admin/properties"
            className={`flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-blue-50 transition-all duration-200 group ${
              isCollapsed ? "justify-center" : ""
            }`}
          >
            <div className="w-10 h-10 rounded-lg bg-blue-700 flex items-center justify-center shadow-md group-hover:shadow-lg group-hover:scale-105 transition-all duration-200">
              <RiBuildingLine className="text-lg text-white" />
            </div>
            {!isCollapsed && (
              <span className="font-medium text-gray-700 group-hover:text-blue-700 transition-colors duration-200">
                All Properties
              </span>
            )}
          </Link>
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-gray-100">
          {isCollapsed ? (
            <button
              onClick={handleLogout}
              className="w-10 h-10 rounded-lg bg-red-500 hover:bg-red-600 flex items-center justify-center transition-all duration-200 shadow-md hover:shadow-lg mx-auto"
              aria-label="Logout"
              title="Logout"
            >
              <RiLogoutBoxLine className="text-lg text-white" />
            </button>
          ) : (
            <button
              onClick={handleLogout}
              className="w-full py-3 px-4 rounded-lg bg-red-500 hover:bg-red-600 transition-all duration-200 font-medium flex items-center justify-center gap-2 shadow-md hover:shadow-lg text-white"
            >
              <RiLogoutBoxLine className="text-lg" />
              <span>Logout</span>
            </button>
          )}
        </div>
      </div>
    </aside>
  );
};

export default AdminSidebar;
