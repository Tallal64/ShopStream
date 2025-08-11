import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/auth/useAuthStore";
import { useCartAPIs } from "@/store/product/useCartAPIs";
import { ShoppingCart } from "lucide-react";
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
  const { addToCart, getItemsFromCart } = useCartAPIs();
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
      await getItemsFromCart();
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
