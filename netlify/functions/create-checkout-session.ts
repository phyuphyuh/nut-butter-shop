import { Handler } from '@netlify/functions';
import Stripe from 'stripe';
import type { CartItem } from '../../src/types/cart';

interface CheckoutRequest {
  items: CartItem[];
  user?: {
    id: string;
    email: string;
    name?: string;
  };
  guestEmail?: string;
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-08-27.basil',
});

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { items, user, guestEmail } = JSON.parse(event.body || '{}') as CheckoutRequest;

    if (!items || !Array.isArray(items)) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Invalid items payload' }) };
    }

    // Determine customer email and metadata
    const customerEmail = user?.email || guestEmail;
    const isAuthenticated = !!user;

    // Create a unique identifier for the user/customer
    const clientReferenceId = user?.id || guestEmail || `guest_${Date.now()}`;

    const sessionConfig: Stripe.Checkout.SessionCreateParams = {
      payment_method_types: ['card'],
      line_items: items.map((item) => ({
        price: item.priceId,
        quantity: item.quantity,
      })),
      mode: 'payment',
      success_url: `${process.env.URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.URL}/shop`,
      client_reference_id: clientReferenceId, // for webhook identification
      metadata: {
        isAuthenticated: isAuthenticated.toString(),
        userId: user?.id || guestEmail || 'guest',
        userName: user?.name || '',
        cartItems: JSON.stringify(items.map(item => ({
          id: item.id,
          name: item.name,
          quantity: item.quantity,
          price: item.price
        }))),
      },
    };

    // Add customer email if provided
    if (customerEmail) {
      sessionConfig.customer_email = customerEmail;
    }

    // For authenticated users, add more metadata
    if (user) {
      sessionConfig.metadata = {
        ...sessionConfig.metadata,
        userName: user.name || '',
      };
    }

    const session = await stripe.checkout.sessions.create(sessionConfig);

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': process.env.ALLOWED_ORIGIN || '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sessionId: session.id,
        customerId: session.customer,
        isAuthenticated,
      }),
    };
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: (error as Error).message }),
    };
  }
};
