// src/pages/admin/AdminLayout.jsx
import AdminSidebar from "../../components/AdminSidebar";

export default function AdminLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <div className="ml-72 mt-0 transition-all duration-300">
        {" "}
        {/* Adjust margin when sidebar collapses */}
        <main className="p-6 w-full">{children}</main>
      </div>
    </div>
  );
}
