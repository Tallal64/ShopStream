import toast from "react-hot-toast";
import { create } from "zustand";

export const useAuthStore = create((set) => ({
  user: undefined,
  isLoading: false,

  registerUser: async (userData) => {
    try {
      set({ isLoading: true });
      const response = await fetch("http://localhost:8080/api/user/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: userData.username,
          email: userData.email,
          password: userData.password,
          role: userData.role,
        }),
        credentials: "include",
      });

      const responseData = await response.json();
      if (responseData.success) {
        set({ user: responseData.user });
      } else {
        toast.error(responseData.error || "Registration failed");
        console.error(responseData.error || "Registration failed");
      }
      return responseData;
    } catch (error) {
      console.error("Error during user registration:", error);
      return {
        success: false,
        error: "Network error or server unavailable",
      };
    } finally {
      set({ isLoading: false });
    }
  },

  loginUser: async (credentials) => {
    try {
      set({ isLoading: true });
      const response = await fetch("http://localhost:8080/api/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: credentials.email,
          password: credentials.password,
        }),
        credentials: "include",
      });

      const responseData = await response.json();
      if (responseData.success) {
        set({ user: responseData.user });
        toast.success("Login successful");
      } else {
        toast.error(responseData.error || "Login failed");
        console.error(responseData.error || "Login failed");
      }
    } catch (error) {
      console.error("Error during user login:", error);
      return {
        success: false,
        error: "Network error or server unavailable",
      };
    } finally {
      set({ isLoading: false });
    }
  },

  logout: async () => {
    try {
      set({ isLoading: true });
      const response = await fetch("http://localhost:8080/api/user/logout", {
        method: "POST",
        credentials: "include",
      });

      const responseData = await response.json();
      if (responseData.success) {
        set({ user: undefined });
        toast.success(responseData.message || "Logout successful");
      } else {
        toast.error(responseData.error || "Logout failed");
        console.error(responseData.error || "Logout failed");
      }
    } catch (error) {
      console.error("Error during user logout:", error);
    } finally {
      set({ isLoading: false });
    }
  },

  getCurrentUser: async () => {
    try {
      set({ isLoading: true });
      const response = await fetch("http://localhost:8080/api/user/me", {
        method: "GET",
        credentials: "include",
      });

      const responseData = await response.json();
      if (responseData.success) {
        set({ user: responseData.user });
        toast.success(
          `welcome back ${
            responseData.user.username || responseData.user.email
          }`
        );
      } else {
        console.error(responseData.error || "Failed to fetch current user");
        toast.error(responseData.error || "Failed to fetch current user");
        set({ user: undefined });
      }
    } catch (error) {
      console.error("Error fetching current user:", error);
    } finally {
      set({ isLoading: false });
    }
  },

  refreshAccessToken: async () => {
    try {
      set({ isLoading: true });
      const response = await fetch(
        "http://localhost:8080/api/user/refresh-token",
        {
          method: "POST",
          credentials: "include",
        }
      );

      const responseData = await response.json();
      if (responseData.success) {
        console.log(
          responseData.message || "Access token refreshed successfully"
        );
      } else {
        toast.error(responseData.error || "Failed to refresh access token");
        console.error(responseData.error || "Failed to refresh access token");
      }
      return responseData;
    } catch (error) {
      console.error("Error refreshing access token:", error);
    } finally {
      set({ isLoading: false });
    }
  },
}));
