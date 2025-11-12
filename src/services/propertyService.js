// src/services/propertyService.js
import api from "./api";

// ✅ Fetch all properties
export const fetchProperties = () => api.get("/properties");

// ✅ Fetch a single property by ID
export const fetchPropertyById = (id) => api.get(`/properties/${id}`);

// ✅ Delete a property by ID
export const deleteProperty = (id) => api.delete(`/properties/${id}`);

// ✅ Search properties with filters (optional parameters)
export const searchProperties = (filters) => {
  const params = new URLSearchParams();

  Object.keys(filters).forEach((key) => {
    const value = filters[key];
    if (value !== "" && value !== null && value !== undefined) {
      params.append(key, value);
    }
  });

  return api.get(`/properties/search?${params.toString()}`);
};
