import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/auth/useAuthStore";
import { useCartAPIs } from "@/store/product/useCartAPIs";

export function UpdateCartQuantityBtn({
  productId,
  newQuantity,
  icon,
  size = "icon",
  variant = "outline",
  className = "h-8 w-8",
  ...restProps
}) {
  const { getItemsFromCart, updateQuantity } = useCartAPIs();
  const { user } = useAuthStore();

  const handleCartQuantityUpdate = async () => {
    if (!user) return;

    const response = await updateQuantity(productId, newQuantity);
    if (response.success) {
      await getItemsFromCart();
    } else {
      console.error("Failed to update cart item quantity:", response.error);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      onClick={handleCartQuantityUpdate}
      disabled={newQuantity < 1}
      {...restProps}
    >
      {icon}
    </Button>
  );
}
