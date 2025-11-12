// src/pages/PropertyDetail.jsx
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchPropertyById } from "../services/propertyService";

// Helper for image URL — assumes Cloudinary / hosted URL
const getImageUrl = (imagePath) => {
  if (!imagePath) return "https://placehold.co/600x400?text=No+Image";
  return imagePath; // directly use Cloudinary URL
};

export default function PropertyDetail() {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadProperty = async () => {
      try {
        const res = await fetchPropertyById(id);
        if (res.data.success) {
          setProperty(res.data.data);
        } else {
          setError("Property not found");
        }
      } catch (err) {
        setError("Server error or property not found");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadProperty();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-xl">Loading property...</div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
        <div className="text-red-600 text-lg mb-4">
          {error || "Property not found"}
        </div>
        <Link to="/" className="text-blue-600 hover:underline font-medium">
          ← Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link to="/" className="text-blue-600 hover:underline">
            ← Back to Listings
          </Link>
        </div>

        {/* Title & Price */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">{property.title}</h1>
          <p className="text-2xl font-semibold text-green-600 mt-2">
            KES {property.price.toLocaleString()}
          </p>
          <div className="flex items-center mt-2 text-gray-600">
            <span>
              {property.location?.town}, {property.location?.county}
            </span>
            <span className="mx-2">•</span>
            <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-sm">
              {property.propertyType === "sale" ? "For Sale" : "For Rent"}
            </span>
          </div>
        </div>

        {/* Gallery */}
        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {property.images?.length > 0 ? (
              property.images.map((img, i) => (
                <img
                  key={i}
                  src={getImageUrl(img)}
                  alt={`${property.title} - ${i + 1}`}
                  className="w-full h-64 object-cover rounded-lg shadow"
                  onError={(e) =>
                    (e.target.src =
                      "https://placehold.co/600x400?text=No+Image")
                  }
                />
              ))
            ) : (
              <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                <span className="text-gray-500">No Images</span>
              </div>
            )}
          </div>
        </div>

        {/* Description */}
        <div className="mb-8 bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-bold mb-4">Description</h2>
          <p className="text-gray-700 whitespace-pre-line">
            {property.description}
          </p>
        </div>

        {/* Specifications */}
        {property.specs && (
          <div className="mb-8 bg-white p-6 rounded-xl shadow">
            <h2 className="text-xl font-bold mb-4">Property Details</h2>
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

        {/* Contact CTA */}
        <div className="bg-white p-6 rounded-xl shadow text-center">
          <h2 className="text-xl font-bold mb-4">
            Interested in this property?
          </h2>
          <a
            href={`https://wa.me/${property.postedBy?.whatsappContact?.replace(
              /\s+/g,
              ""
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition shadow-md"
          >
            📞 Contact on WhatsApp
          </a>
          <p className="mt-2 text-gray-600 text-sm">
            You'll be redirected to WhatsApp to message the owner.
          </p>
        </div>
      </div>
    </div>
  );
}
