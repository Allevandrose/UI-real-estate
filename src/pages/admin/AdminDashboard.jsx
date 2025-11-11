import { Link } from "react-router-dom";

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-600">Manage your property listings.</p>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <LinkCard
              to="/admin/properties"
              title="All Properties"
              description="View, edit, or delete listings"
            />
            <LinkCard
              to="/admin/properties/new"
              title="Add New Property"
              description="Create a new listing"
            />
            {/* Add more cards later */}
          </div>
        </div>
      </div>
    </div>
  );
}

function LinkCard({ to, title, description }) {
  return (
    <Link
      to={to}
      className="block p-5 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition"
    >
      <h3 className="font-semibold text-lg text-gray-800">{title}</h3>
      <p className="text-gray-600 text-sm mt-1">{description}</p>
    </Link>
  );
}
