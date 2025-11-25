// src/pages/Login.jsx
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux"; // Add useSelector
import { useNavigate } from "react-router-dom";
import { loginUser } from "../store/authSlice";
import { Link } from "react-router-dom";

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth); // Get user state

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("Attempting login...");
      await dispatch(loginUser(formData)).unwrap();
      console.log("Login action dispatched successfully.");

      // The user state in Redux should be updated by now by the fulfilled case
      console.log("User state after login dispatch:", user);
      const isAdmin = user?.role === "admin"; // Check the updated state
      console.log("Is admin after login?", isAdmin);

      if (isAdmin) {
        console.log("Redirecting to /admin...");
        navigate("/admin");
      } else {
        console.log("Not an admin, redirecting to /...");
        navigate("/");
      }
    } catch (error) {
      console.error("Login failed:", error);
      // alert("Login failed: " + (error.message || "Unknown error"));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Email</label>
            <input
              name="email"
              value={formData.email}
              onChange={handleChange}
              type="email"
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 mb-2">Password</label>
            <input
              name="password"
              value={formData.password}
              onChange={handleChange}
              type="password"
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            Login
          </button>
        </form>
        <p className="mt-4 text-center text-gray-600">
          Don't have an account?{" "}
          <Link to="/register" className="text-blue-600 hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
