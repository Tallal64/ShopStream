import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/auth/useAuthStore";
import { useProductStore } from "@/store/product/useProductStore";
import { ShoppingCart } from "lucide-react";
import React from "react";
import toast from "react-hot-toast";

export default function AddToCartBtn({
  product,
  quantity,
  icon,
  size,
  variant,
  className,
  ...restProps
}) {
  const { addToCart } = useProductStore();
  const { user } = useAuthStore();

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      toast.error("You must be logged in to add items to the cart.");
      return;
    }

    const response = await addToCart(product?._id, quantity);
    if (response.success) {
      toast.success(response.message || "Item added to cart");
    } else {
      toast.error(response.error || "Failed to add item to cart");
    }
  };

  return (
    <Button
      variant={variant || "default"}
      size={size || "lg"}
      className={className || ""}
      onClick={(e) => handleAddToCart(e)}
      {...restProps}
    >
      {icon && <ShoppingCart className="w-6 h-6 mr-3" />}
      Add to Cart
    </Button>
  );
}
