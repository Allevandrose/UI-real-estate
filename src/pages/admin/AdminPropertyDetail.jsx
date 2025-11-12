// src/pages/admin/AdminPropertyDetail.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchPropertyById } from "../../services/propertyService";

export default function AdminPropertyDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getImageUrl = (imagePath) => {
    if (!imagePath) return "https://placehold.co/600x400?text=No+Image";
    return `http://localhost:5000${imagePath}`;
  };

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
      {/* Header with back & edit buttons */}
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

      {/* Property Title & Price */}
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

      {/* Gallery */}
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

      {/* Specs */}
      {property.specs && (
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4">Specifications</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {property.specs.bedrooms !== undefined && (
              <div className="bg-white p-3 rounded shadow">
                <p className="text-sm text-gray-500">Bedrooms</p>
                <p className="font-medium">{property.specs.bedrooms}</p>
              </div>
            )}
            {property.specs.bathrooms !== undefined && (
              <div className="bg-white p-3 rounded shadow">
                <p className="text-sm text-gray-500">Bathrooms</p>
                <p className="font-medium">{property.specs.bathrooms}</p>
              </div>
            )}
            <div className="bg-white p-3 rounded shadow">
              <p className="text-sm text-gray-500">Furnished</p>
              <p className="font-medium">
                {property.specs.isFurnished ? "Yes" : "No"}
              </p>
            </div>
            {property.specs.kitchens !== undefined && (
              <div className="bg-white p-3 rounded shadow">
                <p className="text-sm text-gray-500">Kitchens</p>
                <p className="font-medium">{property.specs.kitchens}</p>
              </div>
            )}
            {property.specs.livingRooms !== undefined && (
              <div className="bg-white p-3 rounded shadow">
                <p className="text-sm text-gray-500">Living Rooms</p>
                <p className="font-medium">{property.specs.livingRooms}</p>
              </div>
            )}
            {property.specs.parkingSpaces !== undefined && (
              <div className="bg-white p-3 rounded shadow">
                <p className="text-sm text-gray-500">Parking Spaces</p>
                <p className="font-medium">{property.specs.parkingSpaces}</p>
              </div>
            )}
            {property.specs.upperFloors !== undefined && (
              <div className="bg-white p-3 rounded shadow">
                <p className="text-sm text-gray-500">Upper Floors</p>
                <p className="font-medium">{property.specs.upperFloors}</p>
              </div>
            )}
            {property.specs.roofType && (
              <div className="bg-white p-3 rounded shadow">
                <p className="text-sm text-gray-500">Roof Type</p>
                <p className="font-medium">{property.specs.roofType}</p>
              </div>
            )}
            {property.specs.floorType && (
              <div className="bg-white p-3 rounded shadow">
                <p className="text-sm text-gray-500">Floor Type</p>
                <p className="font-medium">{property.specs.floorType}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Owner Info (for admin reference) */}
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <h3 className="font-medium text-blue-800 mb-1">Owner</h3>
        <p className="text-gray-700">
          WhatsApp: {property.postedBy.whatsappContact}
        </p>
      </div>
    </div>
  );
}
