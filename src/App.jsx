// src/App.jsx
import {
  Routes,
  Route,
  useLocation,
  Navigate,
  useNavigate,
} from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react"; // Add useState
import Navbar from "./components/Navbar";
import ChatAssistant from "./components/ChatAssistant";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminLayout from "./pages/admin/AdminLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import { Outlet } from "react-router-dom";
import { initializeAuth } from "./store/authSlice"; // Make sure this import is there

// Admin Pages
import PropertyList from "./pages/admin/PropertyList";
import CreateProperty from "./pages/admin/CreateProperty";
import AdminPropertyDetail from "./pages/admin/AdminPropertyDetail";
import EditProperty from "./pages/admin/EditProperty";

// Public Property Detail Page
import PropertyDetail from "./pages/PropertyDetail";

// A dedicated component to protect admin routes based on user role
const AdminRouteGuard = () => {
  const { isAuthenticated, user, loading } = useSelector((state) => state.auth); // Include loading state if available

  // Optional: Add a check to ensure initializeAuth has run if needed
  // const dispatch = useDispatch();
  // useEffect(() => {
  //   dispatch(initializeAuth());
  // }, [dispatch]);

  console.log("AdminRouteGuard - isAuthenticated:", isAuthenticated);
  console.log("AdminRouteGuard - user:", user);
  console.log("AdminRouteGuard - user?.role:", user?.role);

  // If auth is still loading, show a loading state or nothing
  if (loading) {
    // If your authSlice doesn't have a loading state, remove this check
    return <div>Checking authentication...</div>;
  }

  // If not authenticated at all, redirect to login
  if (!isAuthenticated) {
    console.log("AdminRouteGuard - Not authenticated, redirecting to login.");
    return <Navigate to="/login" replace />;
  }

  // If authenticated but not an admin, redirect to home
  if (user?.role !== "admin") {
    console.log(
      "AdminRouteGuard - Authenticated but not admin, redirecting to home."
    );
    return <Navigate to="/" replace />;
  }

  // If authenticated AND is admin, allow access to admin routes
  console.log(
    "AdminRouteGuard - Authenticated and is admin, rendering admin routes."
  );
  return <Outlet />;
};

function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");
  const { user, isAuthenticated, loading } = useSelector((state) => state.auth); // Get state
  const dispatch = useDispatch();

  // Add this useEffect to initialize auth state from localStorage
  useEffect(() => {
    console.log("App - Running initializeAuth");
    dispatch(initializeAuth());
  }, [dispatch]);

  // Optional: Log the auth state changes for debugging
  useEffect(() => {
    console.log("App - Auth state changed:", {
      isAuthenticated,
      user,
      loading,
    });
  }, [isAuthenticated, user, loading]);

  return (
    <>
      {/* Show Navbar only on non-admin routes */}
      {!isAdminRoute && <Navbar />}

      <div className={!isAdminRoute ? "pt-20" : ""}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/property/:id" element={<PropertyDetail />} />

          {/* Protected Admin Routes */}
          <Route element={<AdminRouteGuard />}>
            <Route
              path="/admin"
              element={
                <AdminLayout>
                  <AdminDashboard />
                </AdminLayout>
              }
            />
            <Route
              path="/admin/properties"
              element={
                <AdminLayout>
                  <PropertyList />
                </AdminLayout>
              }
            />
            <Route
              path="/admin/properties/new"
              element={
                <AdminLayout>
                  <CreateProperty />
                </AdminLayout>
              }
            />
            {/* Detail view */}
            <Route
              path="/admin/properties/:id"
              element={
                <AdminLayout>
                  <AdminPropertyDetail />
                </AdminLayout>
              }
            />
            {/* Edit form — must come AFTER detail route */}
            <Route
              path="/admin/properties/edit/:id"
              element={
                <AdminLayout>
                  <EditProperty />
                </AdminLayout>
              }
            />
          </Route>
        </Routes>
      </div>

      {/* Show ChatAssistant only on non-admin routes */}
      {!isAdminRoute && <ChatAssistant />}
    </>
  );
}

export default App;
