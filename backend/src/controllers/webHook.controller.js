import { Cart } from "../models/cart.model.js";
import { Order } from "../models/order.model.js";
import { stripe } from "../utils/stripe.js";

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

export const webHookHandler = async (req, res) => {
  const sig = req.headers["stripe-signature"];

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case "checkout.session.completed":
      const session = event.data.object;

      try {
        const orderId = session.metadata.orderId;
        const userId = session.metadata.userId;

        if (!orderId || !userId) {
          console.error("Missing orderId or userId in session metadata");
          return res
            .status(400)
            .send("Missing orderId or userId in session metadata");
        }

        // Find the order in our database
        const order = await Order.findById(orderId);
        // Update order status to 'paid'
        if (order) {
          order.status = "paid";
          order.paymentId = session.payment_intent;
          order.paidAt = new Date();
          await order.save();

          // Clear user's cart
          await Cart.deleteMany({ user: userId });
        } else {
          console.error("This might indicate a data consistency issue.");
          return res.status(400).json({ error: "Order not found" });
        }
      } catch (error) {
        console.error(
          `Error handling checkout.session.completed event:`,
          error
        );
        console.error(
          "The payment was successful, but we couldn't update our database."
        );
      }
      break;

    default:
      console.log(`Received Unhandled event type ${event.type}`);
      console.log("This event type is not processed by our webhook handler.");
  }

  res.json({ received: true });
};
