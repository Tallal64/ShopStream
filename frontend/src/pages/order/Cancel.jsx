import {
  XCircle,
  ArrowLeft,
  RefreshCw,
  HelpCircle,
  ShoppingCart,
  Home,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useCartAPIs } from "@/store/product/useCartAPIs";
import toast from "react-hot-toast";

export default function CancelPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { cart, getItemsFromCart, createCheckoutSession, isLoading } =
    useCartAPIs();

  // Get cancellation reason from URL parameters if available
  const sessionId = searchParams.get("session_id");
  const cancelled = searchParams.get("cancelled");
  const error = searchParams.get("error");

  // Load cart items when component mounts
  useEffect(() => {
    getItemsFromCart();
  }, [getItemsFromCart]);

  // Handle retry payment
  const handleRetryPayment = async () => {
    if (!cart || cart.length === 0) {
      toast.error("Your cart is empty. Please add items before checkout.");
      navigate("/cart");
      return;
    }

    try {
      console.log("🔄 Retrying payment with existing cart items");
      await createCheckoutSession(cart);
    } catch (error) {
      console.error("Retry payment failed:", error);
      toast.error("Failed to retry payment. Please try again.");
    }
  };

  // Get cancellation message based on reason
  const getCancellationMessage = () => {
    if (error) {
      return "There was an error processing your payment.";
    }
    if (cancelled) {
      return "You cancelled the payment process.";
    }
    return "Your payment was cancelled. No charges have been made to your account.";
  };

  // Get appropriate title based on situation
  const getTitle = () => {
    if (error) return "Payment Error";
    return "Payment Cancelled";
  };

  // Calculate cart total if available
  const cartTotal =
    cart?.reduce((total, item) => {
      return total + (item.product?.price || 0) * item.quantity;
    }, 0) || 0;

  return (
    <div className="mt-10 bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-3xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="relative mb-6">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-destructive rounded-full mb-4">
              <XCircle className="w-12 h-12 text-destructive-foreground" />
            </div>
            {/* Subtle decorative elements */}
            <div className="absolute -top-4 -left-4 w-3 h-3 bg-muted rounded-full opacity-50"></div>
            <div className="absolute -top-2 -right-6 w-2 h-2 bg-muted rounded-full opacity-30"></div>
            <div className="absolute -bottom-2 -left-8 w-4 h-4 bg-muted rounded-full opacity-40"></div>
            <div className="absolute -bottom-4 -right-4 w-3 h-3 bg-muted rounded-full opacity-60"></div>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            {getTitle()}
          </h1>
          <p className="text-xl text-muted-foreground max-w-md mx-auto">
            {getCancellationMessage()}
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Session Details Card */}
          <Card className="border-border shadow-lg">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold text-foreground mb-4">
                Session Details
              </h2>

              <div className="space-y-3">
                {sessionId && (
                  <>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Session ID</span>
                      <span className="font-mono text-foreground text-sm">
                        #{sessionId.slice(-8).toUpperCase()}
                      </span>
                    </div>
                    <Separator />
                  </>
                )}

                {cartTotal > 0 && (
                  <>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">
                        Attempted Amount
                      </span>
                      <span className="text-xl font-bold text-muted-foreground line-through">
                        ${cartTotal.toFixed(2)}
                      </span>
                    </div>
                    <Separator />
                  </>
                )}

                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Status</span>
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                    {error ? "Error" : "Cancelled"}
                  </span>
                </div>

                <Separator />

                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Date</span>
                  <span className="text-foreground text-sm">
                    {new Date().toLocaleDateString()}
                  </span>
                </div>

                <Separator />

                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Charge</span>
                  <span className="text-green-600 font-semibold">
                    $0.00 (No charge)
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Cart Status Card */}
          <Card className="border-border shadow-lg">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold text-foreground mb-4">
                Your Cart Status
              </h2>

              {cart && cart.length > 0 ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800">
                    <ShoppingCart className="w-5 h-5 text-blue-600" />
                    <div className="flex-1">
                      <p className="font-medium text-blue-900 dark:text-blue-100">
                        Good news! Your cart is preserved
                      </p>
                      <p className="text-sm text-blue-700 dark:text-blue-300">
                        {cart.length} item(s) waiting for checkout
                      </p>
                    </div>
                  </div>

                  <div className="text-sm text-muted-foreground">
                    <p className="mb-2">Items in your cart:</p>
                    <div className="space-y-1 max-h-24 overflow-y-auto">
                      {cart.slice(0, 3).map((item, index) => (
                        <div key={index} className="flex justify-between">
                          <span className="truncate">
                            {item.product?.title || "Product"}
                          </span>
                          <span className="font-medium">×{item.quantity}</span>
                        </div>
                      ))}
                      {cart.length > 3 && (
                        <div className="text-center text-xs py-1">
                          ... and {cart.length - 3} more items
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4">
                  <ShoppingCart className="w-12 h-12 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-muted-foreground">Your cart is empty</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Next Steps Section */}
        <div className="mt-8">
          <h2 className="text-2xl font-semibold text-foreground text-center mb-6">
            What would you like to do next?
          </h2>

          <div className="grid gap-4 max-w-2xl mx-auto">
            {/* Primary Actions */}
            <div className="grid md:grid-cols-2 gap-4">
              {cart && cart.length > 0 ? (
                <Button
                  size="lg"
                  className="h-12 font-medium group"
                  onClick={handleRetryPayment}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <RefreshCw className="w-4 h-4 mr-2 group-hover:rotate-180 transition-transform duration-300" />
                  )}
                  Try Payment Again
                </Button>
              ) : (
                <Button asChild size="lg" className="h-12 font-medium group">
                  <Link to="/">
                    <Home className="w-4 h-4 mr-2" />
                    Continue Shopping
                  </Link>
                </Button>
              )}

              <Button
                asChild
                size="lg"
                variant="outline"
                className="h-12 font-medium group"
              >
                <Link to="/cart">
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  {cart && cart.length > 0 ? "Review Cart" : "Go to Cart"}
                </Link>
              </Button>
            </div>

            {/* Secondary Actions */}
            <div className="grid md:grid-cols-2 gap-4">
              <Button
                asChild
                size="lg"
                variant="outline"
                className="h-12 font-medium group"
              >
                <Link to="/">
                  <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                  Back to Shop
                </Link>
              </Button>

              <Button
                size="lg"
                variant="secondary"
                className="h-12 font-medium"
              >
                <HelpCircle className="w-4 h-4 mr-2" />
                Need Help?
              </Button>
            </div>
          </div>

          {/* Help Text */}
          <div className="mt-6 text-center text-sm text-muted-foreground max-w-lg mx-auto">
            <p>
              {error
                ? "If you continue to experience issues, please contact our support team."
                : "Don't worry, you can try again anytime. Your cart items are saved for you."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
