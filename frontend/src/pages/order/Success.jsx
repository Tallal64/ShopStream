import { CheckCircle, Download, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";

export default function SuccessPage() {
  // State to manage the component's data and loading states
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get URL parameters (Stripe adds session_id to the success URL)
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id"); // Stripe Checkout session ID from the URL after payment

  // Fetch order data when component loads
  useEffect(() => {
    const fetchOrderData = async () => {
      try {
        setLoading(true);

        // If we have a session_id, we can fetch order by session_id
        // Otherwise, we'll just get the most recent order
        const endpoint = sessionId
          ? `/api/order/by-session/${sessionId}`
          : "/api/order/my-orders";

        const response = await fetch(endpoint, {
          method: "GET",
          credentials: "include", // Include auth cookies
        });

        const result = await response.json();

        if (result.success) {
          if (sessionId) {
            // Single order from session ID
            setOrder(result.data);
          } else {
            // Get the most recent order from the list
            const orders = result.data || [];
            const latestOrder = orders.length > 0 ? orders[0] : null;
            setOrder(latestOrder);
          }
          console.log("Order data loaded successfully");
        } else {
          console.error("Failed to fetch order data:", result.error);
          setError("Unable to load order details");
          toast.error("Failed to load order information");
        }
      } catch (err) {
        console.error("Error fetching order data:", err);
        setError("Failed to load order details");
        toast.error("Failed to load order information");
      } finally {
        setLoading(false);
      }
    };

    fetchOrderData();
  }, [sessionId]);

  if (loading) {
    return (
      <div className="mt-10 bg-background flex items-center justify-center p-4 min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-primary" />
          <h2 className="text-xl font-semibold mb-2">
            Loading Your Order Details...
          </h2>
          <p className="text-muted-foreground">
            Please wait while we fetch your order information
          </p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="mt-10 bg-background flex items-center justify-center p-4 min-h-[60vh]">
        <div className="text-center max-w-md mx-auto">
          <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-destructive" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Payment Successful!</h2>
          <p className="text-muted-foreground mb-6">
            Your payment was processed successfully, but we're having trouble
            loading the order details.
          </p>
          <div className="space-y-2">
            <Button asChild className="w-full">
              <Link to="/">Continue Shopping</Link>
            </Button>
            <Button variant="outline" asChild className="w-full">
              <Link to="/my-orders">View Order History</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Calculate totals
  const totalItems =
    order.products?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="mt-10 bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-4xl mx-auto">
        {/* Header Section with Celebration */}
        <div className="text-center mb-8">
          <div className="relative mb-6">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-primary rounded-full mb-4 animate-bounce">
              <CheckCircle className="w-12 h-12 text-primary-foreground" />
            </div>
            {/* Confetti-like decorative elements */}
            <div className="absolute -top-4 -left-4 w-3 h-3 bg-secondary rounded-full animate-pulse"></div>
            <div className="absolute -top-2 -right-6 w-2 h-2 bg-accent rounded-full animate-pulse delay-300"></div>
            <div className="absolute -bottom-2 -left-8 w-4 h-4 bg-secondary rounded-full animate-pulse delay-500"></div>
            <div className="absolute -bottom-4 -right-4 w-3 h-3 bg-accent rounded-full animate-pulse delay-700"></div>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Payment Successful!
          </h1>
          <p className="text-xl text-muted-foreground max-w-md mx-auto">
            Thank you for your purchase. Your order has been confirmed!
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {/* Order Details Card */}
          <Card className="border-border shadow-lg">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold text-foreground mb-4">
                Order Details
              </h2>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Order ID</span>
                  <span className="font-mono text-foreground text-sm">
                    #{order._id.slice(-8).toUpperCase()}
                  </span>
                </div>

                <Separator />

                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Total Items</span>
                  <span className="font-medium">{totalItems}</span>
                </div>

                <Separator />

                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Total Amount</span>
                  <span className="text-2xl font-bold text-primary">
                    ${order.totalAmount?.toFixed(2)}
                  </span>
                </div>

                <Separator />

                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Status</span>
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                    {order.status === "paid" ? "Completed" : order.status}
                  </span>
                </div>

                <Separator />

                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Order Date</span>
                  <span className="text-foreground text-sm">
                    {formatDate(order.createdAt)}
                  </span>
                </div>

                {order.paidAt && (
                  <>
                    <Separator />
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Paid At</span>
                      <span className="text-foreground text-sm">
                        {formatDate(order.paidAt)}
                      </span>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Products List */}
          <Card className="border-border shadow-lg">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold text-foreground mb-4">
                Items Purchased
              </h2>

              <div className="space-y-4 max-h-80 overflow-y-auto">
                {order.products?.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 p-3 rounded-lg bg-muted/50"
                  >
                    {item.product?.image && (
                      <img
                        src={item.product.image}
                        alt={item.product.title || "Product"}
                        className="w-12 h-12 object-cover rounded-md"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sm line-clamp-1">
                        {item.product?.title || "Product"}
                      </h3>
                      <p className="text-muted-foreground text-xs">
                        ${item.product?.price?.toFixed(2)} × {item.quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-sm">
                        ${(item.product?.price * item.quantity)?.toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Next Steps Section */}
        <div className="mt-8">
          <h2 className="text-2xl font-semibold text-foreground text-center mb-6">
            What's Next?
          </h2>

          <div className="grid md:grid-cols-3 gap-4 max-w-2xl mx-auto">
            <Button
              size="lg"
              variant="outline"
              className="h-12 font-medium group"
            >
              <Download className="w-4 h-4 mr-2 group-hover:animate-bounce" />
              Receipt
            </Button>

            <Button asChild size="lg" className="h-12 font-medium group">
              <Link to="/">
                Continue Shopping
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>

            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-12 font-medium"
            >
              <Link to="/my-orders">Order History</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
