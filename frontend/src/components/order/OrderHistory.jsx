import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Calendar,
  Package,
  CreditCard,
  Eye,
  ShoppingBag,
  Loader2,
  AlertCircle,
  Receipt,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import toast from "react-hot-toast";

export default function OrderHistory() {
  // Component state management
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch orders when component loads
  useEffect(() => {
    fetchOrders();
  }, []);

  /**
   * Fetch user orders from the API
   * This function handles all the API communication and error handling
   */
  const fetchOrders = async () => {
    try {
      console.log("📋 Fetching user orders...");
      setLoading(true);
      setError(null);

      const response = await fetch("/api/order/my-orders", {
        method: "GET",
        credentials: "include", // Include authentication cookies
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        setOrders(result.data || []);
        console.log(`✅ Loaded ${result.count} orders successfully`);
      } else {
        throw new Error(result.error || "Failed to fetch orders");
      }
    } catch (err) {
      console.error("❌ Error fetching orders:", err);
      setError(err.message);
      toast.error("Failed to load order history");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Format date to a human-readable string
   * Example: "January 15, 2024 at 2:30 PM"
   */
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  /**
   * Get badge styling based on order status
   * Returns appropriate colors for different order states
   */
  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: {
        variant: "outline",
        className:
          "border-yellow-500 text-yellow-700 bg-yellow-50 dark:bg-yellow-950/20",
        text: "Processing",
      },
      paid: {
        variant: "outline",
        className:
          "border-green-500 text-green-700 bg-green-50 dark:bg-green-950/20",
        text: "Completed",
      },
      cancelled: {
        variant: "outline",
        className: "border-red-500 text-red-700 bg-red-50 dark:bg-red-950/20",
        text: "Cancelled",
      },
      failed: {
        variant: "outline",
        className: "border-red-500 text-red-700 bg-red-50 dark:bg-red-950/20",
        text: "Failed",
      },
    };

    return statusConfig[status] || statusConfig.pending;
  };

  /**
   * Retry loading orders if there was an error
   */
  const handleRetry = () => {
    fetchOrders();
  };

  // Show loading state while fetching data
  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-primary" />
          <h3 className="text-lg font-semibold mb-2">Loading Your Orders</h3>
          <p className="text-muted-foreground">
            Please wait while we fetch your order history
          </p>
        </div>
      </div>
    );
  }

  // Show error state if something went wrong
  if (error) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center max-w-md mx-auto">
          <AlertCircle className="w-16 h-16 mx-auto mb-4 text-destructive" />
          <h3 className="text-lg font-semibold mb-2">Failed to Load Orders</h3>
          <p className="text-muted-foreground mb-6">
            We couldn't load your order history. Please try again.
          </p>
          <div className="space-y-2">
            <Button onClick={handleRetry} className="w-full">
              Try Again
            </Button>
            <Button variant="outline" asChild className="w-full">
              <Link to="/">Continue Shopping</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Show empty state if user has no orders
  if (orders.length === 0) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center max-w-md mx-auto">
          <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-xl font-semibold mb-2">No Orders Yet</h3>
          <p className="text-muted-foreground mb-6">
            You haven't placed any orders yet. Start shopping to see your order
            history here.
          </p>
          <Button asChild className="px-8">
            <Link to="/">Start Shopping</Link>
          </Button>
        </div>
      </div>
    );
  }

  // Main component render
  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Order History
        </h1>
        <p className="text-muted-foreground">
          View all your past orders and their current status
        </p>
      </div>

      {/* Orders Summary */}
      <div className="mb-6 p-4 bg-muted/50 rounded-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Receipt className="w-5 h-5 text-primary" />
            <span className="font-medium">
              {orders.length} {orders.length === 1 ? "Order" : "Orders"} Found
            </span>
          </div>
          <div className="text-sm text-muted-foreground">
            Total Spent: $
            {orders
              .reduce((sum, order) => sum + order.totalAmount, 0)
              .toFixed(2)}
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-6">
        {orders.map((order) => {
          const statusConfig = getStatusBadge(order.status);

          return (
            <Card
              key={order._id}
              className="border shadow-sm hover:shadow-md transition-shadow"
            >
              <CardContent className="p-6">
                {/* Order Header */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-lg mb-1">
                      Order #{order._id.slice(-8).toUpperCase()}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {formatDate(order.createdAt)}
                      </div>
                      <div className="flex items-center gap-1">
                        <Package className="w-4 h-4" />
                        {order.totalItems} item
                        {order.totalItems !== 1 ? "s" : ""}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <Badge
                      variant={statusConfig.variant}
                      className={statusConfig.className}
                    >
                      {statusConfig.text}
                    </Badge>
                  </div>
                </div>

                {/* Order Details */}
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Products List */}
                  <div>
                    <h4 className="font-medium mb-3">Items Ordered</h4>
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {order.products.slice(0, 3).map((item, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-3 text-sm"
                        >
                          {item.product?.image && (
                            <img
                              src={item.product.image}
                              alt={item.product.title || "Product"}
                              className="w-8 h-8 object-cover rounded"
                            />
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="truncate font-medium">
                              {item.product?.title || "Product"}
                            </p>
                            <p className="text-muted-foreground">
                              Qty: {item.quantity} × $
                              {item.product?.price?.toFixed(2)}
                            </p>
                          </div>
                        </div>
                      ))}
                      {order.products.length > 3 && (
                        <p className="text-xs text-muted-foreground text-center py-1">
                          ... and {order.products.length - 3} more items
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Order Summary */}
                  <div>
                    <h4 className="font-medium mb-3">Order Summary</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span>${order.totalAmount.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Shipping</span>
                        <span className="text-green-600">Free</span>
                      </div>
                      <Separator className="my-2" />
                      <div className="flex justify-between font-semibold">
                        <span>Total</span>
                        <span>${order.totalAmount.toFixed(2)}</span>
                      </div>

                      {/* Payment Info */}
                      {order.paidAt && (
                        <div className="mt-3 pt-2 border-t">
                          <div className="flex items-center gap-2 text-xs text-green-600">
                            <CreditCard className="w-3 h-3" />
                            Paid on {formatDate(order.paidAt)}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Order Actions */}
                <div className="mt-6 pt-4 border-t flex gap-2">
                  <Button asChild size="sm" variant="outline">
                    <Link to={`/order/${order._id}`}>
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </Link>
                  </Button>

                  {order.status === "paid" && (
                    <Button size="sm" variant="outline">
                      <Receipt className="w-4 h-4 mr-2" />
                      Download Receipt
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Load More Button (if needed for pagination in the future) */}
      {orders.length > 0 && (
        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            Showing {orders.length} order{orders.length !== 1 ? "s" : ""}
          </p>
        </div>
      )}
    </div>
  );
}
