import api from "./api";

// Fetch all properties
export const fetchProperties = () => api.get("/properties");

// Delete a property by ID
export const deleteProperty = (id) => api.delete(`/properties/${id}`);
