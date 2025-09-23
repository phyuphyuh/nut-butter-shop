import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useCart } from '../../hooks/useCart';
import { guestCheckout, authenticatedCheckout } from '../../services/checkout';

const CheckoutButton: React.FC = () => {
  const { user, isAuthenticated, loginWithRedirect } = useAuth(); // Added loginWithRedirect
  const { state } = useCart();
  const [guestEmail, setGuestEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showGuestForm, setShowGuestForm] = useState(false);

  const handleAuthenticatedCheckout = async () => {
    if (!user || state.items.length === 0) return;

    setIsLoading(true);
    try {
      await authenticatedCheckout(state.items, {
        id: user.sub!,
        email: user.email!,
        name: user.name,
      });
    } catch (error) {
      console.error('Checkout failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginAndCheckout = () => {
    // Trigger Auth0 login
    loginWithRedirect();
  };

  const handleGuestCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestEmail || state.items.length === 0) return;

    setIsLoading(true);
    try {
      await guestCheckout(state.items, guestEmail);
    } catch (error) {
      console.error('Guest checkout failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (state.items.length === 0) {
    return <p>Your cart is empty</p>;
  }

  return (
    <div className="checkout-section">
      {isAuthenticated ? (
        // Authenticated user checkout
        <div>
          <p>Logged in as: {user?.email}</p>
          <button
            onClick={handleAuthenticatedCheckout}
            disabled={isLoading}
            className="checkout-button authenticated"
          >
            {isLoading ? 'Processing...' : `Checkout ($${(state.total / 100).toFixed(2)})`}
          </button>
        </div>
      ) : (
        // Guest checkout options
        <div>
          <button
            onClick={handleLoginAndCheckout}
            className="checkout-button login-first"
            disabled={isLoading}
          >
            Log In & Checkout
          </button>

          {!showGuestForm ? (
            <button
              onClick={() => setShowGuestForm(true)}
              className="checkout-button guest"
              disabled={isLoading}
            >
              Continue as Guest
            </button>
          ) : (
            <form onSubmit={handleGuestCheckout} className="guest-checkout-form">
              <input
                type="email"
                placeholder="Enter your email"
                value={guestEmail}
                onChange={(e) => setGuestEmail(e.target.value)}
                required
                className="guest-email-input"
              />
              <button
                type="submit"
                disabled={isLoading || !guestEmail}
                className="checkout-button guest-submit"
              >
                {isLoading ? 'Processing...' : `Checkout ($${(state.total / 100).toFixed(2)})`}
              </button>
              <button
                type="button"
                onClick={() => setShowGuestForm(false)}
                className="checkout-button cancel"
                disabled={isLoading}
              >
                Cancel
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
};

export default CheckoutButton;
