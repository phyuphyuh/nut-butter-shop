import { Handler } from '@netlify/functions';
import Stripe from 'stripe';
import { StripeProduct } from '../../src/types/product';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-08-27.basil",
});

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'GET') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const productsResponse = await stripe.products.list({
      active: true,
      expand: ['data.default_price'],
    });

    const products: StripeProduct[] = productsResponse.data.map((product) => {
      const price = product.default_price as Stripe.Price;

      return {
        id: product.id,
        name: product.name,
        description: product.description,
        images: product.images,
        metadata: product.metadata,
        default_price: {
          id: price.id,
          unit_amount: price.unit_amount ?? 0,
          currency: price.currency,
        },
      };
    })
    .filter(product => product.metadata?.project === 'nut-butter-shop');

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': process.env.ALLOWED_ORIGIN || '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ products }),
    };
  } catch (error) {
    console.error('Error fetching products:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch products' }),
    };
  }
};
