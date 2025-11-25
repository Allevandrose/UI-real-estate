import { Link } from "react-router-dom";

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-md p-4 sm:p-6">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">
            Manage your property listings.
          </p>
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
      className="block p-4 sm:p-5 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 min-h-[100px]"
    >
      <h3 className="font-semibold text-base sm:text-lg text-gray-800">
        {title}
      </h3>
      <p className="text-gray-600 text-xs sm:text-sm mt-1">{description}</p>
    </Link>
  );
}
