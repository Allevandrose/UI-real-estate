// src/store/authSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../services/api";
import Swal from "sweetalert2";
import { jwtDecode } from "jwt-decode"; // Import jwt-decode

// Async thunk: Register
export const registerUser = createAsyncThunk(
  "auth/register",
  async (userData, { rejectWithValue }) => {
    try {
      const res = await api.post("/auth/register", userData);
      if (res.data.success) {
        localStorage.setItem("token", res.data.token);
        return { token: res.data.token, user: jwtDecode(res.data.token) };
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
        // Decode token to get user info
        const decoded = jwtDecode(res.data.token);
        return { token: res.data.token, user: decoded };
      }
      return rejectWithValue(res.data.message || "Login failed");
    } catch (err) {
      const msg = err.response?.data?.message || "Invalid email or password";
      Swal.fire("Error", msg, "error");
      return rejectWithValue(msg);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    token: localStorage.getItem("token") || null,
    user: localStorage.getItem("token")
      ? jwtDecode(localStorage.getItem("token"))
      : null,
    loading: false,
    error: null,
    isAuthenticated: !!localStorage.getItem("token"),
  },
  reducers: {
    logout: (state) => {
      localStorage.removeItem("token");
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
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
        state.user = action.payload.user;
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
        state.user = action.payload.user;
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

export const { logout } = authSlice.actions;
export default authSlice.reducer;
