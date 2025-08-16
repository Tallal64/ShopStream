import { Order } from "../models/order.model.js";
import { stripe } from "../utils/stripe.js";

export const createCheckoutSession = async (req, res) => {
  try {
    const { products } = req.body;

    if (!products || !Array.isArray(products) || products.length === 0) {
      // TODO: change the message to a more user-friendly one
      return res.status(400).json({
        error: "products are not array or No products provided for checkout.",
      });
    }

    const line_items = products.map((p) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: p.name,
          image: p.image,
        },
        unit_amount: p.price * 100, // Convert to cents (because Stripe expects amounts in cents)
      },
      quantity: p.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      line_items: line_items,
      mode: "payment",
      success_url: "http://localhost:5173/success",
      cancel_url: "http://localhost:5173/cancel",
    });

    const order = await Order.create({
      user: req.user._id,
      products: products.map((p) => ({
        product: p.productId,
        quantity: p.quantity,
      })),
      totalAmount: products.reduce(
        (total, p) => total + p.price * p.quantity,
        0
      ),
      stripeSessionId: session.id,
    });

    await order.save();

    return res.json({ url: session.url });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return res.status(500).json({
      error: "An error occurred while creating the checkout session.",
    });
  }
};
