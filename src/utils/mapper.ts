import type { StripeProduct } from "../types/product";
import type { CartItem } from "../types/cart";

export function mapStripeProductToCartItem(product: StripeProduct): CartItem {
  return {
    id: product.id,
    name: product.name,
    price: product.default_price.unit_amount,
    priceId: product.default_price.id,
    quantity: 1, // default when adding to cart
    image: product.images[0] || "", // fallback if no image
  };
}
