// src/pages/admin/PropertyList.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {
  fetchProperties,
  deleteProperty,
} from "../../services/propertyService";

export default function PropertyList() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // ✅ FIXED: No encoding — just concatenate
  const getImageUrl = (imagePath) => {
    if (!imagePath) return "https://placehold.co/600x400?text=No+Image";
    return `http://localhost:5000${imagePath}`;
  };

  useEffect(() => {
    const loadProperties = async () => {
      try {
        const res = await fetchProperties();
        if (res.data.success) {
          setProperties(res.data.data || []);
        }
      } catch (err) {
        setError("Failed to load properties");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadProperties();
  }, []);

  const handleDelete = async (id, title) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `Delete "${title}"? This cannot be undone.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#d33",
    });

    if (result.isConfirmed) {
      try {
        await deleteProperty(id);
        setProperties((prev) => prev.filter((p) => p._id !== id));
        Swal.fire("Deleted!", "Property has been removed.", "success");
      } catch (err) {
        const msg =
          err.response?.data?.message ||
          "Failed to delete property. You may not own it.";
        Swal.fire("Error", msg, "error");
      }
    }
  };

  const handleEdit = (id) => {
    navigate(`/admin/properties/edit/${id}`);
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-white rounded-lg shadow"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-red-600">
        <p>{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">All Properties</h1>
        <button
          onClick={() => navigate("/admin/properties/new")}
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
        >
          + Add New
        </button>
      </div>

      {properties.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-500">No properties found.</p>
          <button
            onClick={() => navigate("/admin/properties/new")}
            className="mt-4 text-blue-600 hover:underline"
          >
            Add your first property
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <div
              key={property._id}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition"
            >
              {property.images && property.images.length > 0 ? (
                <img
                  src={getImageUrl(property.images[0])}
                  alt={property.title}
                  className="w-full h-48 object-cover"
                  onError={(e) => {
                    // ✅ Fixed: no leading space in URL
                    e.target.src = "https://placehold.co/600x400?text=No+Image";
                  }}
                />
              ) : (
                <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500">No Image</span>
                </div>
              )}

              <div className="p-5">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-lg text-gray-800 line-clamp-1">
                      {property.title}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {property.location.town}, {property.location.county}
                    </p>
                  </div>
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                    {property.propertyType === "sale" ? "For Sale" : "For Rent"}
                  </span>
                </div>

                <p className="mt-2 text-lg font-semibold text-green-600">
                  KES {property.price.toLocaleString()}
                </p>

                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => handleEdit(property._id)}
                    className="flex-1 bg-blue-600 text-white py-1.5 rounded text-sm hover:bg-blue-700 transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(property._id, property.title)}
                    className="flex-1 bg-red-600 text-white py-1.5 rounded text-sm hover:bg-red-700 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
