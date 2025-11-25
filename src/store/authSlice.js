// src/store/authSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../services/api";
import Swal from "sweetalert2";

// Async thunk: Register
export const registerUser = createAsyncThunk(
  "auth/register",
  async (userData, { rejectWithValue }) => {
    try {
      const res = await api.post("/auth/register", userData);
      if (res.data.success) {
        localStorage.setItem("token", res.data.token);
        // Store user data from the response, not from token decoding
        localStorage.setItem("user", JSON.stringify(res.data.user));
        return { token: res.data.token, user: res.data.user };
      }
      return rejectWithValue(res.data.message || "Registration failed");
    } catch (err) {
      const msg = err.response?.data?.message || "Network error";
      Swal.fire("Error", msg, "error");
      return rejectWithValue(msg);
    }
  }
);

// Async thunk: Login
export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const res = await api.post("/auth/login", credentials);
      if (res.data.success) {
        localStorage.setItem("token", res.data.token);
        // Store user data from the response, not from token decoding
        localStorage.setItem("user", JSON.stringify(res.data.user));
        return { token: res.data.token, user: res.data.user };
      }
      return rejectWithValue(res.data.message || "Login failed");
    } catch (err) {
      const msg = err.response?.data?.message || "Invalid email or password";
      Swal.fire("Error", msg, "error");
      return rejectWithValue(msg);
    }
  }
);

// Helper function to safely get user from localStorage
const getUserFromStorage = () => {
  if (typeof window !== "undefined") {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  }
  return null;
};

// Helper function to safely get token from localStorage
const getTokenFromStorage = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token");
  }
  return null;
};

const authSlice = createSlice({
  name: "auth",
  initialState: {
    token: null, // Initialize as null, will be updated in useEffect
    user: null, // Initialize as null, will be updated in useEffect
    loading: false,
    error: null,
    isAuthenticated: false, // Initialize as false, will be updated in useEffect
  },
  reducers: {
    logout: (state) => {
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
    },
    // Add a new action to initialize auth state from localStorage
    initializeAuth: (state) => {
      const token = getTokenFromStorage();
      const user = getUserFromStorage();

      if (token && user) {
        state.token = token;
        state.user = user;
        state.isAuthenticated = true;
      }
    },
  },
  extraReducers: (builder) => {
    // Register
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user; // This now contains the full user object with role
        state.isAuthenticated = true;
        state.error = null;
        Swal.fire("Success", "Account created! Redirecting...", "success");
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user; // This now contains the full user object with role
        state.isAuthenticated = true;
        state.error = null;
        Swal.fire("Success", "Logged in successfully!", "success");
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout, initializeAuth } = authSlice.actions;
export default authSlice.reducer;
