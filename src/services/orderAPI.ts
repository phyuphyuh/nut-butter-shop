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
    if (!userId) {
      console.warn('fetchUserOrders called without userId');
      return [];
    }

    // Simulate API delay for better UX
    await new Promise(resolve => setTimeout(resolve, 500));

    // Get orders from localStorage
    const savedOrders = localStorage.getItem(`user_orders_${userId}`);
    const orders = savedOrders ? JSON.parse(savedOrders) : [];

    console.log(`Found ${orders.length} orders for user ${userId}`);
    return orders;
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
  if (!userId) {
    throw new Error('User ID is required to create an order');
  }

  const order: Order = {
    id: `order_${Date.now()}`,
    userId,
    items,
    total: items.reduce((sum, item) => sum + (item.price * item.quantity), 0),
    status: 'completed',
    createdAt: new Date().toISOString(),
    stripeSessionId,
  };

  // Save to localStorage
  const existingOrders = await fetchUserOrders(userId);

  // Check for duplicates
  const orderExists = existingOrders.some(existingOrder =>
    existingOrder.stripeSessionId === stripeSessionId
  );

  if (orderExists) {
    console.log('Order already exists for session:', stripeSessionId);
    return existingOrders.find(o => o.stripeSessionId === stripeSessionId)!;
  }

  const updatedOrders = [order, ...existingOrders];
  localStorage.setItem(`user_orders_${userId}`, JSON.stringify(updatedOrders));

  console.log('Order created and saved:', order);
  return order;
};

// Helper function to update order status
export const updateOrderStatus = (
  userId: string,
  stripeSessionId: string,
  status: 'pending' | 'completed' | 'cancelled'
) => {
  try {
    if (!userId) {
      console.warn('updateOrderStatus called without userId');
      return;
    }

    const savedOrders = localStorage.getItem(`user_orders_${userId}`);
    if (savedOrders) {
      const orders: Order[] = JSON.parse(savedOrders);
      const updatedOrders = orders.map(order =>
        order.stripeSessionId === stripeSessionId
          ? { ...order, status }
          : order
      );
      localStorage.setItem(`user_orders_${userId}`, JSON.stringify(updatedOrders));
      console.log(`Updated order status to ${status} for session ${stripeSessionId}`);
    }
  } catch (error) {
    console.error('Error updating order status:', error);
  }
};
