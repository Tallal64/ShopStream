import toast from "react-hot-toast";
import { create } from "zustand";

export const useCartAPIs = create((set) => ({
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
        toast.success(response.message || "Item added to cart");
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
      if (responseData && responseData.success) {
        set({ cart: responseData.data?.items });
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

  removeItemFromCart: async (productId) => {
    try {
      set({ isLoading: true });
      const response = await fetch(`/api/cart/${productId}`, {
        credentials: "include",
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseData = await response.json();
      if (responseData && responseData.success) {
        set((state) => ({
          cart: state.cart.filter((item) => item.product?._id !== productId),
        }));
        toast.success("Item removed from cart");
      } else {
        toast.error(responseData?.error || "Failed to remove item from cart");
      }
      return responseData;
    } catch (error) {
      console.error("Error removing item from cart:", error);
      toast.error("Failed to remove item from cart: Network error");
      return null;
    } finally {
      set({ isLoading: false });
    }
  },

  updateQuantity: async (productId, newQuantity) => {
    try {
      set({ isLoading: true });
      const response = await fetch(`/api/cart/${productId}`, {
        credentials: "include",
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ newQuantity }),
      });

      const responseData = await response.json();
      if (responseData.success) {
        set((state) => ({
          cart: state.cart.map((item) =>
            item.product?._id === productId
              ? { ...item, quantity: newQuantity }
              : item
          ),
        }));
        toast.success("Cart item quantity updated successfully");
      } else {
        toast.error(
          responseData.error || "Failed to update cart item quantity"
        );
      }
      return responseData;
    } catch (error) {
      console.error("Error updating cart item quantity:", error);
      toast.error("Failed to update cart item quantity: Network error");
    } finally {
      set({ isLoading: false });
    }
  },

  createCheckoutSession: async (products) => {
    try {
      set({ isLoading: true });
      const response = await fetch("/api/order/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          products: products.map((item) => ({
            name: item.product?.title,
            price: item.product?.price,
            quantity: item.quantity,
          })),
        }),
        credentials: "include",
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url; // Stripe hosted page
      } else {
        console.error("Stripe session error:", data);
        toast.error("Failed to create checkout session");
      }
    } catch (error) {
      console.error("Checkout failed:", error);
      toast.error("Checkout failed: Network error");
    } finally {
      set({ isLoading: false });
    }
  },
}));
