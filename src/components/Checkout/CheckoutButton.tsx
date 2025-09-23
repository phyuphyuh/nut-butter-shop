import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useCart } from '../../hooks/useCart';
import { guestCheckout, authenticatedCheckout } from '../../services/checkout';

const CheckoutButton: React.FC = () => {
  const { user, isAuthenticated, loginWithRedirect } = useAuth();
  const { state } = useCart();
  const [guestEmail, setGuestEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showEmailInput, setShowEmailInput] = useState(false);

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
      } else {
        // Guest checkout - need email
        if (!guestEmail) {
          setShowEmailInput(true);
          setIsLoading(false);
          return;
        }
        await guestCheckout(state.items, guestEmail);
      }
    } catch (error) {
      console.error('Checkout failed:', error);
      // show an error message to the user here
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginAndCheckout = () => {
    loginWithRedirect();
  };

  if (state.items.length === 0) {
    return <p>Your cart is empty</p>;
  }

  return (
    <div className="checkout-section">
      {isAuthenticated ? (
        // Authenticated user - simple checkout
        <div>
          <p>Logged in as: {user?.email}</p>
          <button
            onClick={handleCheckout}
            disabled={isLoading}
            className="checkout-button authenticated"
          >
            {isLoading ? 'Processing...' : `Checkout ($${(state.total / 100).toFixed(2)})`}
          </button>
        </div>
      ) : (
        // Guest user options
        <div>
          <button
            onClick={handleLoginAndCheckout}
            className="checkout-button login-first"
            disabled={isLoading}
          >
            Login & Checkout
          </button>

          <div className="divider">or</div>

          {!showEmailInput ? (
            <button
              onClick={() => setShowEmailInput(true)}
              className="checkout-button guest"
              disabled={isLoading}
            >
              Continue as Guest
            </button>
          ) : (
            <form onSubmit={handleCheckout} className="guest-checkout-form">
              <input
                type="email"
                placeholder="Enter your email"
                value={guestEmail}
                onChange={(e) => setGuestEmail(e.target.value)}
                required
                className="guest-email-input"
                autoFocus
              />
              <div className="form-buttons">
                <button
                  type="submit"
                  disabled={isLoading || !guestEmail}
                  className="checkout-button guest-submit"
                >
                  {isLoading ? 'Processing...' : `Checkout ($${(state.total / 100).toFixed(2)})`}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowEmailInput(false);
                    setGuestEmail('');
                  }}
                  className="checkout-button cancel"
                  disabled={isLoading}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
};

export default CheckoutButton;
