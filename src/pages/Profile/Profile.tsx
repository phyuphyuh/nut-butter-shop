import { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useAuth } from "../../hooks/useAuth";
import { useCart } from "../../hooks/useCart";
import { fetchUserOrders, type Order } from "../../services/orderAPI";
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

const Profile = () => {
  const { isLoading, user, getAccessTokenSilently } = useAuth0();
  const { isAuthenticated } = useAuth();
  const { state } = useCart();
  const [accessToken, setAccessToken] = useState<TokenPayload | null>(null);
  const [showTokenDetails, setShowTokenDetails] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [showOrderHistory, setShowOrderHistory] = useState(false);

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

  // Fetch user orders
  const loadOrders = async () => {
    if (!user?.sub) return;

    setOrdersLoading(true);
    try {
      const userOrders = await fetchUserOrders(user.sub);
      setOrders(userOrders);
    } catch (error) {
      console.error('Failed to load orders:', error);
    } finally {
      setOrdersLoading(false);
    }
  };

  const handleViewOrderHistory = () => {
    if (!showOrderHistory && orders.length === 0) {
      loadOrders();
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
    );
  }

  return (
    <div className="profile-page">
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

      <div className="profile-sections">
        <div className="profile-section">
          <h2>Account Information</h2>
          <div className="account-details">
            <div className="detail-row">
              <span className="label">Name:</span>
              <span className="value">{user?.name || "Not provided"}</span>
            </div>
            <div className="detail-row">
              <span className="label">Email:</span>
              <span className="value">{user?.email}</span>
            </div>
            <div className="detail-row">
              <span className="label">Email Verified:</span>
              <span className={`value ${user?.email_verified ? 'verified' : 'unverified'}`}>
                {user?.email_verified ? "✅ Verified" : "❌ Unverified"}
              </span>
            </div>
            <div className="detail-row">
              <span className="label">Account ID:</span>
              <span className="value user-id">{user?.sub}</span>
            </div>
          </div>
        </div>

        <div className="profile-section">
          <h2>Quick Actions</h2>
          <div className="action-buttons">
            <button
              className="btn-primary"
              onClick={handleViewOrderHistory}
              disabled={ordersLoading}
            >
              {ordersLoading ? 'Loading...' : showOrderHistory ? 'Hide Order History' : 'View Order History'}
            </button>
            <button className="btn-secondary" disabled>
              Update Profile
            </button>
            <LogoutButton />
          </div>
        </div>

        {/* Order History Section */}
        {showOrderHistory && (
          <div className="profile-section">
            <h2>Order History</h2>
            {ordersLoading ? (
              <div className="loading">Loading orders...</div>
            ) : orders.length === 0 ? (
              <div className="no-orders">
                <p>No orders found. Start shopping to see your order history!</p>
              </div>
            ) : (
              <div className="orders-list">
                {orders.map((order) => (
                  <div key={order.id} className="order-card">
                    <div className="order-header">
                      <div className="order-info">
                        <h3>Order #{order.id.slice(-8)}</h3>
                        <p className="order-date">
                          {new Date(order.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                      <div className="order-status">
                        <span className={`status-badge ${order.status}`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                        <span className="order-total">
                          ${(order.total / 100).toFixed(2)}
                        </span>
                      </div>
                    </div>

                    <div className="order-items">
                      {order.items.map((item, index) => (
                        <div key={index} className="order-item">
                          <img src={item.image} alt={item.name} className="item-image" />
                          <div className="item-details">
                            <span className="item-name">{item.name}</span>
                            <span className="item-quantity">Qty: {item.quantity}</span>
                          </div>
                          <span className="item-price">
                            ${(item.price / 100).toFixed(2)}
                          </span>
                        </div>
                      ))}
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
                  <div className="token-info">
                    <p><strong>Expires:</strong> {new Date(accessToken.exp * 1000).toLocaleString()}</p>
                    <p><strong>Issued:</strong> {new Date(accessToken.iat * 1000).toLocaleString()}</p>
                    <p><strong>Scopes:</strong> {accessToken.scope}</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
