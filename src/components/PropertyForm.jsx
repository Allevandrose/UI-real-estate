// src/components/PropertyForm.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import api from "../services/api";

export default function PropertyForm({ isEdit = false, initialData = {} }) {
  const navigate = useNavigate();

  // Form state
  const [formData, setFormData] = useState({
    title: initialData.title || "",
    description: initialData.description || "",
    price: initialData.price || "",
    propertyType: initialData.propertyType || "sale",
    category: initialData.category || "apartment",
    "location.county": initialData.location?.county || "",
    "location.town": initialData.location?.town || "",
    "specs.bedrooms": initialData.specs?.bedrooms || "",
    "specs.bathrooms": initialData.specs?.bathrooms || "",
    "specs.isFurnished": initialData.specs?.isFurnished || false,
    "specs.roofType": initialData.specs?.roofType || "",
    "specs.floorType": initialData.specs?.floorType || "",
    "specs.kitchens": initialData.specs?.kitchens || "",
    "specs.livingRooms": initialData.specs?.livingRooms || "",
    "specs.doors": initialData.specs?.doors || "",
    "specs.windows": initialData.specs?.windows || "",
    "specs.parkingSpaces": initialData.specs?.parkingSpaces || "",
    "specs.upperFloors": initialData.specs?.upperFloors || "",
  });

  const [images, setImages] = useState([]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleImageChange = (e) => {
    setImages(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();

    // Append text fields
    Object.keys(formData).forEach((key) => {
      if (formData[key] !== "" && formData[key] !== null) {
        formDataToSend.append(key, formData[key]);
      }
    });

    // Append images
    images.forEach((file) => {
      formDataToSend.append("images", file);
    });

    try {
      const url = isEdit ? `/properties/${initialData._id}` : "/properties";
      const method = isEdit ? "put" : "post";

      const res = await api[method](url, formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.data.success) {
        Swal.fire(
          "Success",
          isEdit ? "Property updated!" : "Property created!",
          "success"
        );
        navigate("/admin/properties");
      }
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        "Failed to save property. Please check required fields.";
      Swal.fire("Error", msg, "error");
      console.error(err);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-xl font-bold mb-6">
        {isEdit ? "Edit Property" : "Add New Property"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title & Description */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-700 mb-2">Title *</label>
            <input
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Price (KES) *</label>
            <input
              name="price"
              type="number"
              value={formData.price}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-gray-700 mb-2">Description *</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="3"
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Type & Category */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-700 mb-2">Type *</label>
            <select
              name="propertyType"
              value={formData.propertyType}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="sale">For Sale</option>
              <option value="rent">For Rent</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Category *</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="apartment">Apartment</option>
              <option value="bungalow">Bungalow</option>
              <option value="land">Land</option>
              <option value="office">Office</option>
            </select>
          </div>
        </div>

        {/* Location */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-700 mb-2">County *</label>
            <input
              name="location.county"
              value={formData["location.county"]}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Town *</label>
            <input
              name="location.town"
              value={formData["location.town"]}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>

        {/* Specs */}
        <div className="border-t pt-6">
          <h3 className="font-medium text-gray-800 mb-4">Property Specs</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Bedrooms", name: "specs.bedrooms" },
              { label: "Bathrooms", name: "specs.bathrooms" },
              { label: "Kitchens", name: "specs.kitchens" },
              { label: "Living Rooms", name: "specs.livingRooms" },
              { label: "Doors", name: "specs.doors" },
              { label: "Windows", name: "specs.windows" },
              { label: "Parking Spaces", name: "specs.parkingSpaces" },
              { label: "Upper Floors", name: "specs.upperFloors" },
            ].map((field) => (
              <div key={field.name}>
                <label className="block text-sm text-gray-600 mb-1">
                  {field.label}
                </label>
                <input
                  type="number"
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  className="w-full px-2 py-1 border rounded text-sm"
                />
              </div>
            ))}
          </div>

          <div className="mt-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="specs.isFurnished"
                checked={formData["specs.isFurnished"]}
                onChange={handleChange}
                className="rounded"
              />
              <span className="text-gray-700">Furnished</span>
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Roof Type
              </label>
              <input
                name="specs.roofType"
                value={formData["specs.roofType"]}
                onChange={handleChange}
                className="w-full px-2 py-1 border rounded text-sm"
                placeholder="e.g., tile, mabati"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Floor Type
              </label>
              <input
                name="specs.floorType"
                value={formData["specs.floorType"]}
                onChange={handleChange}
                className="w-full px-2 py-1 border rounded text-sm"
                placeholder="e.g., tile, wood"
              />
            </div>
          </div>
        </div>

        {/* Images */}
        <div>
          <label className="block text-gray-700 mb-2">
            Images (Max 10, JPG/PNG, up to 10MB each)
          </label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageChange}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          {images.length > 0 && (
            <p className="mt-2 text-sm text-gray-600">
              Selected: {images.length} file(s)
            </p>
          )}
        </div>

        {/* Submit */}
        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition"
          >
            {isEdit ? "Update Property" : "Create Property"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/admin/properties")}
            className="bg-gray-200 text-gray-800 px-6 py-2 rounded-md hover:bg-gray-300 transition"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
