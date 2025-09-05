import { create } from "zustand";
import toast from "react-hot-toast";

export const useAdminAnalyticsAPIs = create((set) => ({
  isLoading: false,
  summary: {
    totalRevenue: 0,
    totalOrders: 0,
  },
  trends: [],

  fetchAnalyticsSummary: async () => {
    set({ isLoading: true });
    try {
      const response = await fetch("/api/analytics/summary", {
        method: "GET",
        credentials: "include", // include cookies for authentication
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch analytics summary");
      }

      const responseData = await response.json();

      if (responseData.success) {
        set({ summary: responseData.summary });
      } else {
        console.error(
          responseData.error || "Failed to fetch analytics summary"
        );
      }
    } catch (error) {
      console.error("Error fetching analytics summary:", error);
      toast.error("Error fetching analytics summary");
    } finally {
      set({ isLoading: false });
    }
  },

  fetchAnalyticsTrends: async () => {
    set({ isLoading: true });
    try {
      const response = await fetch("/api/analytics/trends", {
        method: "GET",
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to fetch trends");

      const responseData = await response.json();
      if (responseData.success) {
        set({ trends: responseData.trends });
      }
    } catch (error) {
      console.error("Error fetching analytics trends:", error);
    } finally {
      set({ isLoading: false });
    }
  },
}));
