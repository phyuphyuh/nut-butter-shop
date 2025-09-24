import { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useAuth } from "../../hooks/useAuth";
import { useCart } from "../../hooks/useCart";
import { fetchUserOrdersFromStripe } from "../../services/stripeAPI";
import LoginButton from "../../components/Auth/LoginButton";
import LogoutButton from "../../components/Auth/LogoutButton";
import "./Profile.scss";

interface TokenPayload extends Record<string, unknown> {
  sub: string;
  aud: string[];
  iat: number;
  exp: number;
  scope: string;
}

interface StripeOrder {
  id: string;
  amount: number;
  currency: string;
  status: string;
  created: number;
  customer_email: string;
  items: Array<{
    name: string;
    quantity: number;
    amount: number;
    images: string[];
  }>;
}

const Profile = () => {
  const { isLoading, user, getAccessTokenSilently } = useAuth0();
  const { isAuthenticated } = useAuth();
  const { state } = useCart();
  const [accessToken, setAccessToken] = useState<TokenPayload | null>(null);
  const [showTokenDetails, setShowTokenDetails] = useState(false);
  const [orders, setOrders] = useState<StripeOrder[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [showOrderHistory, setShowOrderHistory] = useState(false);
  const [customerId, setCustomerId] = useState<string>('');

  useEffect(() => {
    if (isAuthenticated) {
      getAccessTokenSilently()
        .then((token) => {
          const [, payload] = token.split(".");
          const decoded = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
          setAccessToken(decoded);
        })
        .catch((error) => {
          console.error("Error getting access token:", error);
        });
    }
  }, [getAccessTokenSilently, isAuthenticated]);

  // Get customer ID from localStorage (stored during checkout)
  useEffect(() => {
    if (user?.sub) {
      const storedCustomerId = localStorage.getItem(`stripe_customer_${user.sub}`);
      if (storedCustomerId) {
        setCustomerId(storedCustomerId);
        console.log('Found stored customer ID:', storedCustomerId);
      } else {
        console.log('No stored customer ID found for user:', user.sub);
      }
    }
  }, [user?.sub]);

  // Fetch user orders from Sripe
  const loadOrdersFromStripe = async () => {
    if (!user?.email) {
      console.log('Cannot load orders - user email is missing');
      return;
    }

    console.log('Loading orders from Stripe for user:', user.email);
    setOrdersLoading(true);
    try {
      const stripeOrders = await fetchUserOrdersFromStripe(user.email, customerId || undefined);
      console.log('Fetched orders from Stripe:', stripeOrders);
      setOrders(stripeOrders);
    } catch (error) {
      console.error('Failed to load orders from Stripe:', error);
      setOrders([]);
    } finally {
      setOrdersLoading(false);
    }
  };

  const handleViewOrderHistory = () => {
    if (!showOrderHistory && orders.length === 0) {
      loadOrdersFromStripe();
    }
    setShowOrderHistory(!showOrderHistory);
  };

  if (isLoading) {
    return (
      <div className="profile-page">
        <div className="loading-spinner">Loading profile...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="profile-page">
        <div className="profile-container">
          <div className="profile-guest">
            <h1>Welcome to Blue Jar Folks - Nut Butter Shop</h1>
            <p>Create an account to unlock premium features:</p>
            <ul className="benefits-list">
              <li>✅ Save your cart across devices</li>
              <li>✅ Track order history</li>
              <li>✅ Faster checkout experience</li>
              <li>✅ Personalized recommendations</li>
            </ul>
            <LoginButton />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-header">
          <div className="profile-avatar">
            {user?.picture ? (
              <img src={user.picture} alt="Profile" />
            ) : (
              <div className="avatar-placeholder">
                {user?.name?.charAt(0) || user?.email?.charAt(0) || "U"}
              </div>
            )}
          </div>
          <div className="profile-info">
            <h1>{user?.name || "My Profile"}</h1>
            <p className="profile-email">{user?.email}</p>
            <p className="profile-joined">
              Member since {new Date(user?.updated_at || Date.now()).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="profile-stats">
          <div className="stat-card">
            <h3>{state.itemCount}</h3>
            <p>Items in Cart</p>
          </div>
          <div className="stat-card">
            <h3>${(state.total / 100).toFixed(2)}</h3>
            <p>Cart Total</p>
          </div>
          <div className="stat-card">
            <h3>{orders.length}</h3>
            <p>Orders Placed</p>
          </div>
        </div>

        <div className="profile-actions">
          <h2>Quick Actions</h2>
          <div className="action-buttons">
            <button
              className="btn-primary"
              onClick={handleViewOrderHistory}
              disabled={ordersLoading || !user?.email}
            >
              {ordersLoading ? 'Loading...' : showOrderHistory ? 'Hide Order History' : 'View Order History'}
            </button>
            <button className="btn-secondary" disabled>
              Update Profile
            </button>
            <LogoutButton />
          </div>
        </div>

          {/* Order History Section - Fetched from Stripe */}
          {showOrderHistory && (
            <div className="profile-section">
              <h2>Order History</h2>
              <p className="order-source">Showing real transaction data from Stripe</p>
              {ordersLoading ? (
                <div className="loading">Loading orders from Stripe...</div>
              ) : orders.length === 0 ? (
                <div className="no-orders">
                  <p>No orders found. Start shopping to see your order history!</p>
                  <p className="help-text">
                    Orders are fetched directly from Stripe's transaction records.
                  </p>
                </div>
              ) : (
                <div className="orders-list">
                  {orders.map((order) => (
                    <div key={order.id} className="order-card">
                      <div className="order-header">
                        <div className="order-info">
                          <h3>Order #{order.id.slice(-8)}</h3>
                          <p className="order-date">
                            {new Date(order.created * 1000).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                          <p className="order-email">Customer: {order.customer_email}</p>
                        </div>
                        <div className="order-status">
                          <span className={`status-badge ${order.status}`}>
                            {order.status === 'paid' ? 'Completed' :
                            order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </span>
                          <span className="order-total">
                            ${(order.amount / 100).toFixed(2)} {order.currency.toUpperCase()}
                          </span>
                        </div>
                      </div>

                      <div className="order-items">
                        {order.items.length > 0 ? (
                          order.items.map((item, index) => (
                            <div key={index} className="order-item">
                              <img
                                src={item.images[0] || '/placeholder.jpg'}
                                alt={item.name}
                                className="item-image"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = '/placeholder.jpg';
                                }}
                              />
                              <div className="item-details">
                                <span className="item-name">{item.name}</span>
                                <span className="item-quantity">Qty: {item.quantity}</span>
                              </div>
                              <span className="item-price">
                                ${(item.amount / 100).toFixed(2)}
                              </span>
                            </div>
                          ))
                        ) : (
                          <div className="no-items">
                            <p>No item details available for this order.</p>
                          </div>
                        )}
                      </div>

                      {/* Stripe Session ID for debugging */}
                      <div className="order-metadata">
                        <small className="stripe-session-id">
                          Stripe Session: {order.id}
                        </small>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Developer Debug Section (Portfolio Feature) */}
          <div className="profile-section">
            <h2>
              Developer Info
              <button
                className="toggle-btn"
                onClick={() => setShowTokenDetails(!showTokenDetails)}
              >
                {showTokenDetails ? "Hide" : "Show"} Token Details
              </button>
            </h2>

            {showTokenDetails && (
              <div className="token-details">
                <div className="token-section">
                  <h3>ID Token (User Profile)</h3>
                  <pre className="token-display">
                    {JSON.stringify(user, null, 2)}
                  </pre>
                </div>

                {accessToken && (
                  <div className="token-section">
                    <h3>Access Token Payload</h3>
                    <pre className="token-display">
                      {JSON.stringify(accessToken, null, 2)}
                    </pre>
                  </div>
                )}

                <div className="token-section">
                  <h3>Stripe Integration Info</h3>
                  <pre className="token-display">
                    {JSON.stringify({
                      customerIdStored: !!customerId,
                      customerId: customerId || 'Not found',
                      userEmail: user?.email,
                      ordersCount: orders.length,
                      lastOrdersFetch: ordersLoading ? 'Loading...' : 'Ready'
                    }, null, 2)}
                  </pre>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
  );
};

export default Profile;
