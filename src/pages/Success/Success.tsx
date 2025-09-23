import { useEffect, useState } from "react";
import { useSearchParams, Link } from 'react-router-dom';
import { useAuth } from "../../hooks/useAuth";
import { useCart } from "../../hooks/useCart";
import type { Order } from "../../services/orderAPI";
import type { CartItem } from "../../types/cart";
import './Success.scss';

const Success: React.FC = () => {
  const { dispatch } = useCart();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const [orderCreated, setOrderCreated] = useState(false);
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    const createOrderFromPending = () => {
      // Clear the cart
      dispatch({ type: "CLEAR_CART" });

      if (!sessionId) return;

      // Get pending order data that was saved during checkout
      const pendingOrderData = localStorage.getItem('pendingOrder');

      if (pendingOrderData) {
        try {
          const pendingOrder = JSON.parse(pendingOrderData);

          // Create completed order
          const completedOrder: Order = {
            id: `order_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`,
            userId: user?.sub || pendingOrder.email || 'guest',
            stripeSessionId: sessionId,
            total: pendingOrder.items.reduce((sum: number, item: CartItem) => sum + (item.price * item.quantity), 0),
            status: 'completed',
            createdAt: new Date().toISOString(),
            items: pendingOrder.items,
            customerEmail: pendingOrder.email
          };

          // Save to localStorage
          const userId = user?.sub || pendingOrder.email || 'guest';
          const storageKey = `user_orders_${userId}`;
          const existingOrders = JSON.parse(localStorage.getItem(storageKey) || '[]');

          // Check for duplicates
          const orderExists = existingOrders.some((order: Order) =>
            order.stripeSessionId === sessionId
          );

          if (!orderExists) {
            const updatedOrders = [completedOrder, ...existingOrders];
            localStorage.setItem(storageKey, JSON.stringify(updatedOrders));
            setOrderCreated(true);
          }

          // Clean up pending order
          localStorage.removeItem('pendingOrder');

        } catch (error) {
          console.error('Error creating order from pending data:', error);
        }
      }
    };

    createOrderFromPending();
  }, [dispatch, sessionId, user]);

  return (
    <div className="success-container">
      <div className="success-confirmation">
        <h2>🎉 Payment Successful!</h2>
        <p>Thank you for your order!</p>

        {sessionId && (
          <div className="order-info">
            <p><strong>Session ID:</strong> {sessionId.slice(-8)}</p>
            {orderCreated && <p>✅ Order saved to your history</p>}
          </div>
        )}

        <div className="success-actions">
          {user ? (
            <Link to="/profile" className="btn-primary">View Order History</Link>
          ) : (
            <p>Create an account to track your orders!</p>
          )}
          <Link to="/shop" className="btn-secondary">Continue Shopping</Link>
        </div>
      </div>
    </div>
  );
};

export default Success;
