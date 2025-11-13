// src/App.jsx
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
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

// Admin Pages
import PropertyList from "./pages/admin/PropertyList";
import CreateProperty from "./pages/admin/CreateProperty";
import AdminPropertyDetail from "./pages/admin/AdminPropertyDetail";
import EditProperty from "./pages/admin/EditProperty";

// Public Property Detail Page
import PropertyDetail from "./pages/PropertyDetail";

// A dedicated component to protect admin routes based on user role
const AdminRouteGuard = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  // If not authenticated or not an admin, redirect to home
  if (!isAuthenticated || user?.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  // If authenticated and is an admin, render the child routes
  return <Outlet />;
};

function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");
  const { user } = useSelector((state) => state.auth); // Get user for role checks

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
          {/* This route now uses our AdminRouteGuard to check for the 'admin' role */}
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
