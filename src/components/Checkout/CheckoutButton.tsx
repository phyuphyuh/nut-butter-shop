import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useCart } from '../../hooks/useCart';
import { guestCheckout, authenticatedCheckout } from '../../services/checkout';

const CheckoutButton: React.FC = () => {
  const { user, isAuthenticated, loginWithRedirect } = useAuth();
  const { state } = useCart();

  const [guestEmail, setGuestEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showGuestForm, setShowGuestForm] = useState(false);

  const handleCheckout = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (state.items.length === 0) return;

    setIsLoading(true);
    try {
      if (isAuthenticated && user) {
        // Authenticated checkout
        await authenticatedCheckout(state.items, {
          id: user.sub!,
          email: user.email!,
          name: user.name,
        });
      } else if (showGuestForm && guestEmail) {
        // Guest checkout
        await guestCheckout(state.items, guestEmail);
      } else {
        // Not logged in, no guest email → redirect to Auth0 login
        loginWithRedirect();
      }
    } catch (error) {
      console.error('Checkout failed:', error);
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
        // Authenticated checkout
        <div>
          <p>Logged in as: {user?.email}</p>
          <button
            onClick={() => handleCheckout()}
            disabled={isLoading}
            className="checkout-button authenticated"
          >
            {isLoading ? 'Processing...' : `Checkout ($${(state.total / 100).toFixed(2)})`}
          </button>
        </div>
      ) : (
        // Not authenticated → give choice
        <div>
          {!showGuestForm ? (
            <>
              <button
                onClick={() => handleCheckout()}
                className="checkout-button login-first"
                disabled={isLoading}
              >
                Log In & Checkout
              </button>

              <div className="checkout-divider">
                <span>or</span>
              </div>

              <button
                onClick={() => setShowGuestForm(true)}
                className="checkout-button guest"
                disabled={isLoading}
              >
                Continue as Guest
              </button>
            </>
          ) : (
            <form onSubmit={handleCheckout} className="guest-checkout-form">
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
