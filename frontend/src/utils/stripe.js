import { loadStripe } from "@stripe/stripe-js";

const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;

if (!stripePublishableKey) {
  console.error("❌ Stripe publishable key is missing!");
  console.error(
    "Please add VITE_STRIPE_PUBLISHABLE_KEY to your .env.local file"
  );
  console.error("Example: VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here");
}

const stripePromise = loadStripe(stripePublishableKey);

export { stripePromise };

export const getStripe = async () => {
  const stripe = await stripePromise;
  if (!stripe) {
    throw new Error(
      "Stripe failed to load. Check your publishable key and internet connection."
    );
  }
  return stripe;
};
