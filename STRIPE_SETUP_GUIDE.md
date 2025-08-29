# Stripe Integration Setup Guide for ShopStream

This guide will walk you through setting up Stripe payments and webhooks for the ShopStream application. This guide is written for beginners and includes step-by-step instructions.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Getting Stripe API Keys](#getting-stripe-api-keys)
3. [Setting Up Environment Variables](#setting-up-environment-variables)
4. [Installing Stripe CLI](#installing-stripe-cli)
5. [Testing Webhooks Locally](#testing-webhooks-locally)
6. [Testing Payments](#testing-payments)
7. [Production Setup](#production-setup)
8. [Troubleshooting](#troubleshooting)

## Prerequisites

Before starting, make sure you have:

- A Stripe account (free to create at [stripe.com](https://stripe.com))
- Node.js and npm installed
- The ShopStream application running locally
- Basic understanding of command line/terminal

## Getting Stripe API Keys

### Step 1: Create a Stripe Account

1. Go to [https://stripe.com](https://stripe.com)
2. Click "Start now" and create a free account
3. Complete the account setup process

### Step 2: Access Your API Keys

1. Log in to your Stripe Dashboard
2. Navigate to **Developers > API keys** in the left sidebar
3. You'll see your API keys:
   - **Publishable key**: Starts with `pk_test_` (safe to use in frontend)
   - **Secret key**: Starts with `sk_test_` (NEVER share this publicly!)

### Step 3: Copy Your Keys

```bash
# Example keys (these are fake - use your real keys)
Publishable key: pk_test_51234567890abcdefghijklmnop
Secret key: sk_test_51234567890abcdefghijklmnop (keep this secret!)
```

## Setting Up Environment Variables

### Backend Environment Variables (.env file)

Create a `.env` file in the root directory of your project:

```bash
# Copy from .env.sample and fill in your actual values
cp .env.sample .env
```

Update your `.env` file with your Stripe keys:

```bash
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_actual_secret_key_here
STRIPE_PUBLISHABLE_KEY=pk_test_your_actual_publishable_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
```

### Frontend Environment Variables (.env)

Create a `.env` file in the `frontend/` directory:

```bash
cd frontend
touch .env
```

Update `frontend/.env`:

```bash
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_actual_publishable_key_here
```

**Important Notes:**

- Never commit `.env` files to Git
- Only use test keys during development
- The publishable key is safe to use in frontend code
- The secret key should ONLY be used in backend code

## Installing Stripe CLI

The Stripe CLI is a tool that lets you test webhooks locally by forwarding Stripe events to your local development server.

### On macOS:

```bash
brew install stripe/stripe-cli/stripe
```

### On Windows:

1. Download from [https://github.com/stripe/stripe-cli/releases/latest](https://github.com/stripe/stripe-cli/releases/latest)
2. Extract the executable and add it to your PATH

### On Linux:

```bash
# Download the latest release
wget https://github.com/stripe/stripe-cli/releases/latest/download/stripe_1.19.1_linux_x86_64.tar.gz

# Extract it
tar -xvf stripe_1.19.1_linux_x86_64.tar.gz

# Move to your PATH
sudo mv stripe /usr/local/bin/
```

### Verify Installation:

```bash
stripe --version
```

## Testing Webhooks Locally

### Step 1: Login to Stripe CLI

```bash
stripe login
```

Follow the prompts to authenticate with your Stripe account.

### Step 2: Start Your Application

Make sure both your backend and frontend are running:

```bash
# Terminal 1: Start backend
npm run dev

# Terminal 2: Start frontend (in a new terminal)
cd frontend
npm run dev
```

Your backend should be running on `http://localhost:8080`

### Step 3: Forward Webhooks to Your Local Server

Open a third terminal and run:

```bash
stripe listen --forward-to localhost:8080/api/v1/webhook/stripe
```

You should see output like:

```
> Ready! Your webhook signing secret is whsec_1234567890abcdef... (^C to quit)
```

### Step 4: Copy the Webhook Secret

Copy the webhook signing secret (the part after `whsec_`) and add it to your `.env` file:

```bash
STRIPE_WEBHOOK_SECRET=whsec_1234567890abcdef...
```

### Step 5: Restart Your Backend

After updating the `.env` file, restart your backend server:

```bash
# Stop the server (Ctrl+C) and restart it
npm run dev
```

## Testing Payments

### Step 1: Add Items to Cart

1. Open your browser and go to `http://localhost:5173`
2. Browse products and add some items to your cart
3. Go to the cart page and click "Proceed to Checkout"

### Step 2: Use Test Card Numbers

Stripe provides test card numbers for different scenarios:

**Successful Payment:**

```
Card Number: 4242 4242 4242 4242
Expiry: Any future date (e.g., 12/25)
CVC: Any 3 digits (e.g., 123)
ZIP: Any 5 digits (e.g., 12345)
```

**Declined Payment:**

```
Card Number: 4000 0000 0000 0002
Expiry: Any future date
CVC: Any 3 digits
ZIP: Any 5 digits
```

### Step 3: Monitor the Webhook Events

In your Stripe CLI terminal, you should see webhook events like:

```
2024-01-15 10:30:45  --> checkout.session.completed [evt_123...]
2024-01-15 10:30:45  <-- [200] POST http://localhost:8080/api/v1/webhook/stripe [evt_123...]
```

### Step 4: Check Your Application

- **Success Page**: After successful payment, you should be redirected to `/success`
- **Cancel Page**: If you cancel, you should be redirected to `/cancel`
- **Database**: Check that orders are created with status "paid"
- **Cart**: Your cart should be cleared after successful payment

## Production Setup

### Step 1: Get Live API Keys

1. Complete Stripe account activation
2. Switch to "Live mode" in your Stripe dashboard
3. Get your live API keys (starting with `pk_live_` and `sk_live_`)

### Step 2: Set Up Production Webhooks

1. In Stripe Dashboard, go to **Developers > Webhooks**
2. Click "Add endpoint"
3. Set endpoint URL to: `https://yourdomain.com/api/v1/webhook/stripe`
4. Select events to send: `checkout.session.completed`
5. Copy the webhook signing secret

### Step 3: Update Production Environment Variables

Update your production environment with:

```bash
STRIPE_SECRET_KEY=sk_live_your_live_secret_key
STRIPE_PUBLISHABLE_KEY=pk_live_your_live_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_production_webhook_secret
```

## Troubleshooting

### Common Issues and Solutions

#### 1. "Webhook signature verification failed"

**Problem**: Your webhook secret is incorrect or missing.
**Solution**:

- Make sure `STRIPE_WEBHOOK_SECRET` is set in your `.env` file
- Restart your backend server after updating environment variables
- Verify the webhook secret from Stripe CLI output

#### 2. "No such checkout session"

**Problem**: The session ID in the URL doesn't exist.
**Solution**:

- Make sure your checkout session is created successfully
- Check server logs for checkout creation errors
- Verify your Stripe secret key is correct

#### 3. "Checkout session creation failed"

**Problem**: The backend can't create a Stripe checkout session.
**Solution**:

- Check that `STRIPE_SECRET_KEY` is correctly set
- Verify your Stripe account is active
- Check server logs for detailed error messages

#### 4. "Cart is empty after payment"

**Problem**: Cart isn't cleared after successful payment.
**Solution**:

- Check that webhooks are working properly
- Verify the webhook handler is processing `checkout.session.completed` events
- Check database for order status updates

#### 5. Frontend can't connect to Stripe

**Problem**: Stripe.js won't load or throws errors.
**Solution**:

- Verify `VITE_STRIPE_PUBLISHABLE_KEY` is set in `frontend/.env.local`
- Restart your frontend development server
- Check browser console for error messages

### Debug Commands

```bash
# Test webhook delivery
stripe events resend evt_123...

# List recent events
stripe events list --limit 10

# Test your webhook endpoint directly
curl -X POST http://localhost:8080/api/v1/webhook/stripe \
  -H "Content-Type: application/json" \
  -d '{"test": true}'
```

### Logs to Check

**Backend logs**: Look for:

- `✅ Webhook signature verified successfully`
- `🎉 Payment processing completed successfully!`
- `❌` symbols indicate errors

**Frontend console**: Look for:

- Stripe.js loading errors
- Network request failures
- Authentication issues

## Additional Resources

- [Stripe Documentation](https://stripe.com/docs)
- [Stripe CLI Reference](https://stripe.com/docs/stripe-cli)
- [Stripe Test Cards](https://stripe.com/docs/testing#cards)
- [Webhook Best Practices](https://stripe.com/docs/webhooks/best-practices)

## Getting Help

If you encounter issues:

1. Check the troubleshooting section above
2. Review server logs and browser console
3. Search Stripe documentation
4. Check GitHub issues in the project repository

---

**Remember**: Always use test mode during development, and never share your secret keys publicly!
