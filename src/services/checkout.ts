import { loadStripe } from '@stripe/stripe-js';
import type { CartItem } from '../types/cart';

interface User {
  id: string;
  email: string;
  name?: string;
}

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export const createCheckoutSession = async (
  items: CartItem[],
  user?: User,
  guestEmail?: string
) => {
  try {
    const response = await fetch('/.netlify/functions/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ items, user, guestEmail }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    console.error('Failed to create checkout session:', error);
    throw error; // Re-throw for caller to handle
  }
};

// Guest Checkout Flow
export const guestCheckout = async (cartItems: CartItem[], email: string) => {
  try {
    if (!email || !cartItems.length) {
      throw new Error('Email and cart items are required');
    }

    const { sessionId } = await createCheckoutSession(cartItems, undefined, email);

    localStorage.setItem(
      'pendingOrder',
      JSON.stringify({
        sessionId,
        email,
        items: cartItems,
        timestamp: new Date().toISOString(),
      })
    );

    const stripe = await stripePromise;
    if (!stripe) throw new Error('Stripe failed to initialize');

    const result = await stripe.redirectToCheckout({ sessionId });
    if (result.error) {
      throw new Error(result.error.message);
    }
  } catch (error) {
    console.error('Guest checkout failed:', error);
    throw error;
  }
};

// Authenticated Checkout Flow
export const authenticatedCheckout = async (cartItems: CartItem[], user: User) => {
  try {
    if (!user.id || !user.email || !cartItems.length) {
      throw new Error('User information and cart items are required');
    }

    const { sessionId } = await createCheckoutSession(cartItems, user);

    const stripe = await stripePromise;
    if (!stripe) throw new Error('Stripe failed to initialize');

    const result = await stripe.redirectToCheckout({ sessionId });
    if (result.error) {
      throw new Error(result.error.message);
    }
  } catch (error) {
    console.error('Authenticated checkout failed:', error);
    throw error;
  }
};
