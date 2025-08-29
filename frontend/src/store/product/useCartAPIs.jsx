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

      // Basic validation
      if (!products || !Array.isArray(products) || products.length === 0) {
        toast.error("Your cart is empty. Please add items to proceed.");
        return;
      }

      // Validate each product
      const invalidProducts = products.filter(
        (item) =>
          !item.product?._id ||
          !item.product?.title ||
          !item.product?.price ||
          !item.quantity
      );

      if (invalidProducts.length > 0) {
        console.error("Invalid product data found:", invalidProducts);
        toast.error(
          "Some items in your cart are invalid. Please refresh and try again."
        );
        return { success: false, error: "Invalid product data" };
      }

      // prepare data for backend
      const checkoutData = {
        products: products.map((item) => ({
          productId: item.product?._id,
          name: item.product?.title,
          price: item.product?.price,
          image: item.product?.image,
          quantity: item.quantity,
        })),
      };

      const response = await fetch("/api/order/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(checkoutData),
        credentials: "include",
      });

      if (response.status === 401) {
        toast.error("You must be logged in to proceed to checkout.");
        return;
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || `Server error! status: ${response.status}`
        );
      }

      const responseData = await response.json();
      if (responseData && responseData.url) {
        window.location.href = responseData.url;
      } else {
        throw new Error("Invalid response from server. Please try again.");
      }
    } catch (error) {
      console.error("Error creating checkout session frontend:", error);
      toast.error(
        error.message ||
          "Failed to create checkout session. Please try again later."
      );
    } finally {
      set({ isLoading: false });
    }
  },
}));
