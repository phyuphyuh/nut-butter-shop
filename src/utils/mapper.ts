import type { StripeProduct } from "../types/product";
import type { CartItem } from "../types/cart";

export function mapStripeProductToCartItem(product: StripeProduct): CartItem {
  // Validate required fields
  if (!product.id) {
    throw new Error('Product ID is required');
  }

  if (!product.name) {
    throw new Error('Product name is required');
  }

  if (!product.default_price?.id) {
    throw new Error('Product price ID is required');
  }

  return {
    id: product.id,
    name: product.name,
    price: product.default_price.unit_amount || 0,
    priceId: product.default_price.id,
    quantity: 1, // default when adding to cart
    image: product.images[0] || "", // fallback if no image
  };
}
