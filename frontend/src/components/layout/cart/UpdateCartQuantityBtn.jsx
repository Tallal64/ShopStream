import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/auth/useAuthStore";
import { useProductStore } from "@/store/product/useProductStore";

export function UpdateCartQuantityBtn({
  productId,
  newQuantity,
  icon,
  size = "icon",
  variant = "outline",
  className = "h-8 w-8",
  ...restProps
}) {
  const { getItemsFromCart, updateQuantity } = useProductStore();
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
