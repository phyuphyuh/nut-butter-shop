import { useEffect, useState } from "react";
import { useSearchParams, Link } from 'react-router-dom';
import { useAuth } from "../../hooks/useAuth";
import { useCart } from "../../hooks/useCart";
import { createOrder } from "../../services/orderAPI";
import './Success.scss';

const Success: React.FC = () => {
  const { dispatch } = useCart();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const [orderCreated, setOrderCreated] = useState(false);
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    const createOrderFromPending = async () => {
      // Clear the cart
      dispatch({ type: "CLEAR_CART" });

      if (!sessionId || !user?.sub) {
        console.log('Missing sessionId or user.sub:', { sessionId, userSub: user?.sub });
        return;
      }

      // Get pending order data that was saved during checkout
      const pendingOrderData = localStorage.getItem('pendingOrder');

      if (pendingOrderData) {
        try {
          const pendingOrder = JSON.parse(pendingOrderData);

          // Use the createOrder function from orderAPI to ensure consistency
          const completedOrder = await createOrder(
            user.sub, // Use the authenticated user's ID
            pendingOrder.items,
            sessionId
          );

          console.log('Order created successfully:', completedOrder);
          setOrderCreated(true);

          // Clean up pending order
          localStorage.removeItem('pendingOrder');

        } catch (error) {
          console.error('Error creating order from pending data:', error);
        }
      } else {
        console.log('No pending order data found in localStorage');
      }
    };

    createOrderFromPending();
  }, [dispatch, sessionId, user?.sub]);

  return (
    <div className="success-container">
      <div className="success-confirmation">
        <h2>🎉 Payment Successful!</h2>
        <p>Thank you for your order!</p>

        {sessionId && (
          <div className="order-info">
            <p><strong>Session ID:</strong> {sessionId.slice(-8)}</p>
            {orderCreated && <p>✅ Order saved to your history</p>}
            {user?.sub && <p><strong>User ID:</strong> {user.sub}</p>}
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
