// src/pages/ForgotPassword.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import api from "../services/api";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post("/auth/forgotpassword", { email });

      if (res.data.success) {
        // In development, we get the token directly
        if (import.meta.env.DEV && res.data.resetToken) {
          Swal.fire(
            "Token Generated",
            `Your reset token: <strong>${res.data.resetToken}</strong><br/>You’ll be redirected to reset page.`,
            "info"
          );
          setTimeout(() => {
            navigate(`/reset-password/${res.data.resetToken}`);
          }, 2500);
        } else {
          // In production: just confirm email sent
          Swal.fire(
            "Success",
            "Password reset instructions sent to your email.",
            "success"
          );
          setTimeout(() => navigate("/login"), 2000);
        }
      } else {
        Swal.fire("Error", res.data.message || "Request failed", "error");
      }
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        "Failed to send reset instructions. Please try again.";
      Swal.fire("Error", msg, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 pt-16">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">
          Forgot Password?
        </h2>
        <p className="text-gray-600 text-center mb-6">
          Enter your email and we’ll send you a reset link.
        </p>
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-gray-700 mb-2">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="you@example.com"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded font-medium transition ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>
        <p className="mt-4 text-center text-gray-600">
          <button
            onClick={() => navigate("/login")}
            className="text-blue-600 hover:underline"
          >
            ← Back to Login
          </button>
        </p>
      </div>
    </div>
  );
}
