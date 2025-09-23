import type { CartItem } from '../types/cart';

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'completed' | 'cancelled';
  createdAt: string;
  stripeSessionId?: string;
  customerEmail?: string;
}

export const fetchUserOrders = async (userId: string): Promise<Order[]> => {
  try {
    // Simulate API delay for better UX
    await new Promise(resolve => setTimeout(resolve, 500));

    // Get orders from localStorage
    const savedOrders = localStorage.getItem(`user_orders_${userId}`);
    return savedOrders ? JSON.parse(savedOrders) : [];
  } catch (error) {
    console.error('Error fetching user orders:', error);
    return [];
  }
};

export const createOrder = async (
  userId: string,
  items: CartItem[],
  stripeSessionId: string
): Promise<Order> => {
  const order: Order = {
    id: `order_${Date.now()}`,
    userId,
    items,
    total: items.reduce((sum, item) => sum + (item.price * item.quantity), 0),
    status: 'pending',
    createdAt: new Date().toISOString(),
    stripeSessionId,
  };

  // Save to localStorage
  const existingOrders = await fetchUserOrders(userId);
  const updatedOrders = [order, ...existingOrders];
  localStorage.setItem(`user_orders_${userId}`, JSON.stringify(updatedOrders));

  return order;
};

// Helper function to update order status
export const updateOrderStatus = (
  userId: string,
  stripeSessionId: string,
  status: 'pending' | 'completed' | 'cancelled'
) => {
  try {
    const savedOrders = localStorage.getItem(`user_orders_${userId}`);
    if (savedOrders) {
      const orders: Order[] = JSON.parse(savedOrders);
      const updatedOrders = orders.map(order =>
        order.stripeSessionId === stripeSessionId
          ? { ...order, status }
          : order
      );
      localStorage.setItem(`user_orders_${userId}`, JSON.stringify(updatedOrders));
    }
  } catch (error) {
    console.error('Error updating order status:', error);
  }
};
