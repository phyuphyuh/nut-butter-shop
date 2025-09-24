import type { Handler } from '@netlify/functions';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-08-27.basil',
});

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const customerId = event.queryStringParameters?.customer_id;
    const userEmail = event.queryStringParameters?.email;

    if (!customerId && !userEmail) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Customer ID or email is required' }),
      };
    }

    // Fetch checkout sessions for this customer
    const checkoutSessions = await stripe.checkout.sessions.list({
      customer: customerId,
      limit: 100,
    });

    const orders = await formatOrders(checkoutSessions.data);

    return {
      statusCode: 200,
      body: JSON.stringify({ orders }),
    };
  } catch (error) {
    console.error('Error fetching customer orders:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch orders' }),
    };
  }
};

// Helper function to transform checkout sessions into orders
async function formatOrders(sessions: Stripe.Checkout.Session[]) {
  return Promise.all(
    sessions.map(async (session) => {
      let lineItems: Stripe.LineItem[] = [];
      try {
        const items = await stripe.checkout.sessions.listLineItems(session.id, {
          expand: ['data.price.product'],
        });
        lineItems = items.data; // Explicit type for `lineItems`
      } catch (error) {
        console.error(`Error fetching line items for session ${session.id}:`, error);
      }

      return {
        id: session.id,
        amount: session.amount_total || 0,
        currency: session.currency || 'usd',
        status: session.payment_status || 'unknown',
        created: session.created,
        customer_email: session.customer_email || 'unknown',
        items: lineItems.map((item) => ({
          name: (item.price?.product as Stripe.Product)?.name || 'Unknown Product',
          quantity: item.quantity || 1,
          amount: item.price?.unit_amount || 0,
          images: (item.price?.product as Stripe.Product)?.images || [],
        })),
      };
    })
  );
}
