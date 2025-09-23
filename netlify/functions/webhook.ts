import type { Handler } from '@netlify/functions';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-08-27.basil',
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  const sig = event.headers['stripe-signature'];

  if (!sig) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Missing stripe signature' }),
    };
  }

  let stripeEvent: Stripe.Event;

  try {
    stripeEvent = stripe.webhooks.constructEvent(event.body!, sig, endpointSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Invalid signature' }),
    };
  }

  console.log('Received webhook event:', stripeEvent.type);

  try {
    switch (stripeEvent.type) {
      case 'checkout.session.completed': {
        const session = stripeEvent.data.object as Stripe.Checkout.Session;
        console.log('Checkout session completed:', session.id);

        const lineItems = await stripe.checkout.sessions.listLineItems(session.id, {
          expand: ['data.price.product'],
        });

        // Use client_reference_id as the primary identifier, with fallbacks
        const userId = session.client_reference_id ||
                      session.metadata?.userId ||
                      session.customer_email ||
                      'guest';

        const order = {
          id: `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          userId: userId,
          stripeSessionId: session.id,
          stripePaymentIntentId: session.payment_intent as string,
          total: session.amount_total || 0,
          status: 'completed',
          createdAt: new Date().toISOString(),
          customerEmail: session.customer_email,
          items: lineItems.data.map(item => ({
            id: (item.price?.product as Stripe.Product)?.id || '',
            name: (item.price?.product as Stripe.Product)?.name || 'Unknown Product',
            price: item.price?.unit_amount || 0,
            priceId: item.price?.id || '',
            quantity: item.quantity || 1,
            image: (item.price?.product as Stripe.Product)?.images?.[0] || '',
          })),
        };

        console.log('Created order for userId:', userId);
        console.log('Order details:', order);

        console.log('Webhook successfully processed order - this would be saved to database in production');

        break;
      }

      case 'payment_intent.succeeded': {
        const paymentIntent = stripeEvent.data.object as Stripe.PaymentIntent;
        console.log('Payment succeeded:', paymentIntent.id);
        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = stripeEvent.data.object as Stripe.PaymentIntent;
        console.log('Payment failed:', paymentIntent.id);
        break;
      }

      default:
        console.log(`Unhandled event type: ${stripeEvent.type}`);
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ received: true }),
    };
  } catch (error) {
    console.error('Error processing webhook:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};
