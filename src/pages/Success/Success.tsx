import { useEffect } from "react";
import { useCart } from "../../hooks/useCart";
import { useSearchParams, Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import LoginButton from "../../components/Auth/LoginButton";
import './Success.scss';

const Success: React.FC = () => {
  const { dispatch } = useCart();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const { user, isAuthenticated } = useAuth0();

  useEffect(() => {
    // Clear the cart since order completed successfully
    dispatch({ type: "CLEAR_CART" });

    // Clean up pending order from localStorage
    localStorage.removeItem('pendingOrder');

    // Order history will be fetched from Stripe when user views profile
  }, [dispatch]);

  return (
    <div className="success-container">
      <div className="success-confirmation">
        <h2>🎉 Payment Successful!</h2>
        <p>Thank you for your order!</p>
         <p>Session ID: {sessionId}</p>

        <div className="success-actions">
          {isAuthenticated && user ? (
            <>
              <Link to="/profile" className="btn-primary">
                View Your Order History
              </Link>
              <p className="order-note">
                Your order details are now available in your profile.
                We fetch your complete transaction history directly from Stripe!
              </p>
            </>
          ) : (
            <div className="guest-message">
              <p>Your order was processed successfully!</p>
              <p className="account-prompt">
                <strong>Create an account</strong> to track all your orders and access your complete purchase history from Stripe.
              </p>
              <LoginButton />
            </div>
          )}
          <Link to="/shop" className="btn-secondary">Continue Shopping</Link>
        </div>
      </div>
    </div>
  );
};

export default Success;
