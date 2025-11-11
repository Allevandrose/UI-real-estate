import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../store/authSlice";

export default function Navbar() {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/"); // Redirect to home after logout
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="w-10 h-10 bg-blue-700 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl">H</span>
          </div>
          <span className="text-xl font-bold text-gray-900">Home254</span>
        </Link>

        {/* Nav Links */}
        <div className="hidden md:flex gap-8 items-center">
          <Link
            to="/"
            className="text-gray-600 hover:text-blue-700 transition font-medium"
          >
            HOME
          </Link>
          <Link
            to="/about"
            className="text-gray-600 hover:text-blue-700 transition font-medium"
          >
            ABOUT US
          </Link>
          <Link
            to="/services"
            className="text-gray-600 hover:text-blue-700 transition font-medium"
          >
            SERVICES
          </Link>
          <Link
            to="/contact"
            className="text-gray-600 hover:text-blue-700 transition font-medium"
          >
            CONTACT
          </Link>
        </div>

        {/* Auth Section */}
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            // Show Logout + Dashboard
            <>
              <button
                onClick={() => navigate("/admin")}
                className="text-blue-700 font-medium hover:text-blue-800 transition px-4 py-2"
              >
                Dashboard
              </button>
              <button
                onClick={handleLogout}
                className="bg-gray-700 text-white px-5 py-2 rounded-md shadow hover:bg-gray-600 transition font-medium"
              >
                Logout
              </button>
            </>
          ) : (
            // Show Login/Register
            <>
              <Link
                to="/login"
                className="text-blue-700 font-medium hover:text-blue-800 transition px-4 py-2"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-blue-700 text-white px-5 py-2 rounded-md shadow hover:bg-blue-600 transition font-medium"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
