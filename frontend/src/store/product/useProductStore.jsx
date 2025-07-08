import toast from "react-hot-toast";
import { create } from "zustand";

export const useProductStore = create((set) => ({
  products: [],
  isLoading: false,

 createProduct: async (productData) => {
    try {
      set({ isLoading: true });

      const formData = new FormData();
      formData.append("title", productData.title);
      formData.append("price", productData.price);
      formData.append("categories", productData.category);
      formData.append("description", productData.description);
      if (productData.image) {
        formData.append("image", productData.image);
      }

      const response = await fetch("http://localhost:8080/api/products", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      const responseData = await response.json();
      if (responseData.success) {
        set((state) => ({
          products: [...state.products, responseData.data],
        }));
        console.log(responseData.data);
        toast.success("Product created successfully!");
      } else {
        toast.error(responseData.error || "Failed to create product");
      }
      return responseData;
    } catch (error) {
      console.error("Error creating product:", error);
      toast.error("Failed to create product: Network error");
      return { success: false, error: "Network error" };
    } finally {
      set({ isLoading: false });
    }
  },
}));
