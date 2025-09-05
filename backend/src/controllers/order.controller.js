import { Order } from "../models/order.model.js";
import { stripe } from "../utils/stripe.js";

export const createCheckoutSession = async (req, res) => {
  try {
    const { products } = req.body;

    // 1. Prepare line_items for Stripe Checkout
    // Each item needs: price_data (currency, product info, amount) and quantity
    // products = [{_id, title, price, image, quantity}, ...]
    if (!products || !Array.isArray(products) || products.length === 0) {
      console.error("Invalid products provided for checkout:", products);
      return res
        .status(400)
        .json({ message: "No valid products provided for checkout." });
    }
    const line_items = products.map((p) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: p.name,
          images: p.image ? [p.image] : [], // Stripe expects an array of image URLs
        },
        unit_amount: Math.round(p.price * 100), // Stripe expects amount in cents
      },
      quantity: p.quantity, // How many of this item the customer is buying
    }));

    // 2. Create order in our database with status 'pending'
    const order = await Order.create({
      user: req.user._id, // Who is making this order
      products: products.map((p) => ({
        product: p._id || p.product?._id || p.productId, // Which product
        quantity: p.quantity,
      })),
      totalAmount: products.reduce((sum, p) => sum + p.price * p.quantity, 0),
      stripeSessionId: "temp",
    });

    // 3. Create Stripe Checkout session
    // This session will handle the payment process
    const session = await stripe.checkout.sessions.create({
      line_items,
      mode: "payment",
      success_url: process.env.FRONTEND_URL
        ? `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`
        : "http://localhost:5173/success?session_id={CHECKOUT_SESSION_ID}",
      cancel_url: process.env.FRONTEND_URL
        ? `${process.env.FRONTEND_URL}/cancel`
        : "http://localhost:5173/cancel",
      metadata: {
        orderId: order._id.toString(),
        userId: req.user._id.toString(),
      },
    });

    // 4. save the order with the actual session ID
    order.stripeSessionId = session.id;
    await order.save();

    return res.status(200).json({
      success: true,
      url: session.url, // The Stripe checkout page URL
      sessionId: session.id, // In case the frontend needs it
    });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    console.error("Full error details:", error.message);
    return res.status(500).json({
      error: "Something went wrong while creating checkout session.",
    });
  }
};

export const getAllUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).populate({
      path: "products.product",
      select: "title price image category",
    });

    const ordersWithDetails = orders.map((order) => ({
      _id: order._id,
      products: order.products,
      totalAmount: order.totalAmount,
      status: order.status,
      paymentId: order.paymentId,
      paidAt: order.paidAt,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    }));

    return res.json({
      success: true,
      data: ordersWithDetails,
      count: orders.length,
    });
  } catch (error) {
    console.error("Error fetching user orders:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to fetch orders.",
    });
  }
};

export const getOrderBySessionId = async (req, res) => {
  try {
    const { sessionId } = req.params;

    if (!sessionId) {
      return res.status(400).json({ error: "Invalid or missing session ID" });
    }

    const order = await Order.findOne({
      stripeSessionId: sessionId,
      user: req.user._id,
    }).populate({
      path: "products.product",
      select: "title price image category description",
    });

    if (!order) {
      console.log("Order not found for session ID or access denied");
      return res.status(404).json({
        success: false,
        error: "Order not found for this session.",
      });
    }

    const orderDetails = {
      _id: order._id,
      products: order.products,
      totalAmount: order.totalAmount,
      status: order.status,
      stripeSessionId: order.stripeSessionId,
      paymentId: order.paymentId,
      paidAt: order.paidAt,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    };

    return res.status(200).json({
      success: true,
      data: orderDetails,
    });
  } catch (error) {
    console.error("Error fetching order by session ID:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to fetch order details.",
    });
  }
};
