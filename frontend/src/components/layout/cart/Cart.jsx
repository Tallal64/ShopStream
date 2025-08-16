import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useAuthStore } from "@/store/auth/useAuthStore";
import { useCartAPIs } from "@/store/product/useCartAPIs";
import {
  Plus,
  Minus,
  Trash2,
  CreditCard,
  Truck,
  ShoppingBag,
} from "lucide-react";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { UpdateCartQuantityBtn } from "./UpdateCartQuantityBtn";

export function Cart() {
  const { user } = useAuthStore();
  const {
    cart,
    isLoading,
    getItemsFromCart,
    removeItemFromCart,
    createCheckoutSession,
  } = useCartAPIs();

  useEffect(() => {
    const fetchCartItems = async () => {
      if (!user) return;
      await getItemsFromCart();
    };
    fetchCartItems();
  }, [getItemsFromCart, user]);

  const handleRemoveItem = async (productId) => {
    if (!user) return;
    const response = await removeItemFromCart(productId);
    if (response && response.success) {
      await getItemsFromCart();
    } else {
      console.error(
        "Failed to remove item from cart:",
        response?.error || "Unknown error"
      );
    }
  };

  const handleCheckout = async () => {
    await createCheckoutSession(cart);
  };

  // Dynamic calculations
  const subtotal =
    cart?.reduce((acc, item) => {
      if (item.product && item.product.price) {
        return acc + item.product.price * item.quantity;
      }
      return acc;
    }, 0) || 0;

  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + tax;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-32 h-32 mx-auto mb-4 border-b-2 rounded-full animate-spin border-primary"></div>
          <p className="text-lg text-muted-foreground">Loading Cart Items...</p>
        </div>
      </div>
    );
  }

  if (
    !cart ||
    !user ||
    cart.filter((item) => item.product !== null).length === 0
  ) {
    return (
      <div className="py-16 text-center">
        <div className="flex items-center justify-center w-24 h-24 mx-auto mb-6 rounded-full bg-muted">
          <ShoppingBag className="w-12 h-12 text-muted-foreground" />
        </div>
        <h2 className="mb-4 text-2xl font-semibold text-foreground">
          Your cart is empty
        </h2>
        <p className="max-w-md mx-auto mb-8 text-muted-foreground">
          Looks like you haven't added any items to your cart yet. Start
          shopping to fill it up!
        </p>
        <Button asChild className="px-8">
          <Link to="/">Continue Shopping</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-8 bg-background">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-foreground">
            Shopping Cart
          </h1>
          <p className="text-muted-foreground">
            {cart?.filter((item) => item.product !== null).length || 0}
            {cart?.filter((item) => item.product !== null).length == 1
              ? " item "
              : " items "}
            in your cart
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="space-y-4 lg:col-span-2">
            {cart
              ?.filter((item) => item.product !== null)
              .map(
                (item) =>
                  item?.product && (
                    <Card key={item.product?._id} className="p-6">
                      <div className="flex gap-4">
                        <div className="flex-shrink-0 w-24 h-24 overflow-hidden rounded-lg bg-muted">
                          <img
                            src={item.product?.image}
                            alt={item.product?.title}
                            className="object-cover w-full h-full"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <Badge
                                variant="secondary"
                                className="mb-2 text-xs"
                              >
                                {item.product?.category}
                              </Badge>
                              <h3 className="font-semibold text-foreground line-clamp-2">
                                {item.product?.title}
                              </h3>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="flex-shrink-0 text-muted-foreground hover:text-destructive"
                              onClick={() =>
                                handleRemoveItem(item.product?._id)
                              }
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <UpdateCartQuantityBtn
                                productId={item.product?._id}
                                newQuantity={item.quantity - 1}
                                icon={<Minus className="w-3 h-3" />}
                              />
                              <span className="w-8 font-medium text-center">
                                {item.quantity}
                              </span>
                              <UpdateCartQuantityBtn
                                productId={item.product?._id}
                                newQuantity={item.quantity + 1}
                                icon={<Plus className="w-3 h-3" />}
                              />
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-foreground">
                                $
                                {(item.product?.price * item.quantity)?.toFixed(
                                  2
                                )}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                ${item.product?.price?.toFixed(2)} each
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  )
              )}
          </div>

          <div className="lg:col-span-1">
            <Card className="sticky p-6 top-24">
              <h3 className="mb-4 font-semibold text-foreground">
                Order Summary
              </h3>

              <div className="mb-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="font-medium">Free</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tax (8%)</span>
                  <span className="font-medium">${tax.toFixed(2)}</span>
                </div>
              </div>

              <Separator className="my-4" />

              <div className="flex items-center justify-between mb-6">
                <span className="font-semibold text-foreground">Total</span>
                <span className="text-xl font-bold text-foreground">
                  ${total.toFixed(2)}
                </span>
              </div>

              <div className="p-3 mb-4 border rounded-lg bg-green-50 dark:bg-green-950/20">
                <div className="flex items-center gap-2 text-sm">
                  <Truck className="w-4 h-4 text-green-600" />
                  <span className="text-green-800 dark:text-green-400">
                    You qualify for free shipping!
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <Button
                  onClick={handleCheckout}
                  className="w-full h-12 font-semibold"
                >
                  <CreditCard className="w-5 h-5 mr-2" />
                  Proceed to Checkout
                </Button>
                <Button asChild variant="outline" className="w-full">
                  <Link to="/">Continue Shopping</Link>
                </Button>
              </div>

              <div className="pt-4 mt-6 space-y-2 border-t">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Secure 256-bit SSL encryption</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>30-day money-back guarantee</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
