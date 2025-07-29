import toast from "react-hot-toast";
import { create } from "zustand";

export const useProductStore = create((set) => ({
  cart: [],
  isLoading: false,

  addToCart: async (productId, quantity) => {
    try {
      set({ isLoading: true });
      const response = await fetch("/api/cart", {
        credentials: "include",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productId, quantity }),
      });

      const responseData = await response.json();
      if (responseData.success) {
        set((state) => ({
          cart: [...state.cart, { productId, quantity }],
        }));
      } else {
        toast.error(responseData.error || "Failed to add to cart");
      }
      return responseData;
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Failed to add to cart: Network error");
    } finally {
      set({ isLoading: false });
    }
  },

  getItemsFromCart: async () => {
    try {
      set({ isLoading: true });
      const response = await fetch("/api/cart", {
        credentials: "include",
        method: "GET",
      });

      const responseData = await response.json();
      if (responseData.success) {
        set({ cart: responseData.data.items });
      } else {
        console.warn(responseData.error || "Failed to fetch cart items");
      }
      return responseData;
    } catch (error) {
      console.error("Error fetching cart items:", error);
      toast.error("Failed to fetch cart items: Network error");
    } finally {
      set({ isLoading: false });
    }
  },

  // TODO: make these two => updateCartItemQuantity, removeItemFromCart
}));
