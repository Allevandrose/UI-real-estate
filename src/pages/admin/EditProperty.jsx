// src/pages/admin/EditProperty.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { fetchPropertyById } from "../../services/propertyService";
import PropertyForm from "../../components/PropertyForm";

export default function EditProperty() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProperty = async () => {
      try {
        const res = await fetchPropertyById(id);
        if (res.data.success) {
          setProperty(res.data.data);
        }
      } catch (err) {
        Swal.fire("Error", "Failed to load property for editing", "error");
        navigate("/admin/properties");
      } finally {
        setLoading(false);
      }
    };
    loadProperty();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse text-xl">Loading property...</div>
      </div>
    );
  }

  if (!property) {
    return null;
  }

  return <PropertyForm isEdit={true} initialData={property} />;
}
