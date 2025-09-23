import type { CartItem } from "../types/cart";

export function calculateTotals(items: CartItem[]) {
  if (!Array.isArray(items) || items.length === 0) {
    return { itemCount: 0, total: 0 };
  }

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  return { itemCount, total };
}
