import AdminSidebar from "../../components/AdminSidebar";

export default function AdminLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <div className="flex-1 ml-0 lg:ml-72 transition-all duration-300">
        <main className="p-4 sm:p-6 min-h-screen">{children}</main>
      </div>
    </div>
  );
}
