import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminLayout from "./pages/admin/AdminLayout";
import ProtectedRoute from "./components/ProtectedRoute";

// Admin Pages
import PropertyList from "./pages/admin/PropertyList";
import CreateProperty from "./pages/admin/CreateProperty"; // Make sure this exists

function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <>
      {!isAdminRoute && <Navbar />}

      <div className={!isAdminRoute ? "pt-20" : ""}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />

          {/* Protected Admin Routes */}
          <Route element={<ProtectedRoute />}>
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
          </Route>
        </Routes>
      </div>
    </>
  );
}

export default App;
