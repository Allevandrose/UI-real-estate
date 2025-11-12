// src/pages/admin/AdminPropertyDetail.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchPropertyById } from "../../services/propertyService";

// Use env variable for API base URL (for legacy/local images)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL.replace(/\/api$/, "");

// ✅ Helper for image URL — detects if already hosted on Cloudinary
const getImageUrl = (imagePath) => {
  if (!imagePath) return "https://placehold.co/600x400?text=No+Image";
  if (imagePath.startsWith("http")) return imagePath; // Cloudinary or any hosted URL
  return `${API_BASE_URL}${imagePath}`; // fallback for local uploads
};

export default function AdminPropertyDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadProperty = async () => {
      try {
        const res = await fetchPropertyById(id);
        if (res.data.success) {
          setProperty(res.data.data);
        }
      } catch (err) {
        setError("Property not found");
      } finally {
        setLoading(false);
      }
    };
    loadProperty();
  }, [id]);

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse text-xl">Loading property details...</div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="p-8 text-red-600">
        <p>{error || "Property not found"}</p>
        <button
          onClick={() => navigate("/admin/properties")}
          className="mt-4 text-blue-600 hover:underline"
        >
          ← Back to Listings
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => navigate("/admin/properties")}
          className="text-blue-600 hover:underline font-medium"
        >
          ← Back to Properties
        </button>
        <button
          onClick={() => navigate(`/admin/properties/edit/${id}`)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
        >
          Edit Property
        </button>
      </div>

      {/* Title & Price */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">{property.title}</h1>
        <p className="text-2xl font-semibold text-green-600 mt-2">
          KES {property.price.toLocaleString()}
        </p>
        <div className="flex items-center mt-2 text-gray-600">
          <span>
            {property.location.town}, {property.location.county}
          </span>
          <span className="mx-2">•</span>
          <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-sm">
            {property.propertyType === "sale" ? "For Sale" : "For Rent"}
          </span>
          <span className="mx-2">•</span>
          <span className="bg-gray-100 text-gray-800 px-2 py-0.5 rounded text-sm">
            {property.category}
          </span>
        </div>
      </div>

      {/* Images */}
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">Images</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {property.images && property.images.length > 0 ? (
            property.images.map((img, i) => (
              <img
                key={i}
                src={getImageUrl(img)}
                alt={`${property.title} - ${i + 1}`}
                className="w-full h-64 object-cover rounded-lg border"
                onError={(e) => {
                  e.target.src = "https://placehold.co/600x400?text=No+Image";
                }}
              />
            ))
          ) : (
            <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center">
              <span className="text-gray-500">No Images</span>
            </div>
          )}
        </div>
      </div>

      {/* Description */}
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-3">Description</h2>
        <p className="bg-gray-50 p-4 rounded-lg text-gray-700 whitespace-pre-line">
          {property.description}
        </p>
      </div>

      {/* Specifications */}
      {property.specs && (
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4">Specifications</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Object.entries({
              Bedrooms: property.specs.bedrooms,
              Bathrooms: property.specs.bathrooms,
              Kitchens: property.specs.kitchens,
              "Living Rooms": property.specs.livingRooms,
              "Parking Spaces": property.specs.parkingSpaces,
              "Upper Floors": property.specs.upperFloors,
              "Roof Type": property.specs.roofType,
              "Floor Type": property.specs.floorType,
              Furnished: property.specs.isFurnished ? "Yes" : "No",
            }).map(
              ([label, value]) =>
                value !== undefined &&
                value !== "" && (
                  <div
                    key={label}
                    className="bg-white p-3 rounded shadow text-center"
                  >
                    <p className="text-sm text-gray-500">{label}</p>
                    <p className="font-medium">{value}</p>
                  </div>
                )
            )}
          </div>
        </div>
      )}

      {/* Owner Info */}
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <h3 className="font-medium text-blue-800 mb-1">Owner</h3>
        <p className="text-gray-700">
          WhatsApp: {property.postedBy?.whatsappContact || "N/A"}
        </p>
      </div>
    </div>
  );
}
