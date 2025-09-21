import { useCart } from '../../../hooks/useCart';
import { loadStripe } from '@stripe/stripe-js';
import { CartItem } from './CartItem/CartItem';
import './Cart.scss';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const Cart: React.FC = () => {
  const { state, dispatch } = useCart();

  const handleCheckout = async () => {
    try {
      const stripe = await stripePromise;

      const response = await fetch('/.netlify/functions/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: state.items.map(item => ({
            priceId: item.priceId, // from Stripe
            quantity: item.quantity,
          })),
        }),
      });

      const { sessionId } = await response.json();

      if (stripe) {
        await stripe.redirectToCheckout({ sessionId });
        dispatch({ type: 'CLEAR_CART' }); // Clear cart after redirect
      }
    } catch (error) {
      console.error('Checkout error:', error);
    }
  };

  // Use totals from context
  const { total } = state;
  // const tax = total * 0.095;
  // const shipping = 799; // in cents ($7.99)
  // const grandTotal = total + tax + shipping;

  return (
    <div className="cart">
      <ul className="cart-list">
        {state.items.length === 0 ? (
          <li className='none'>Your cart is empty.</li>
        ) : (
          state.items.map(item => <CartItem key={item.id} item={item} />)
        )}
      </ul>

      <div className="cart-totals">
        <span>Subtotal:</span>
        <span>${(total / 100).toFixed(2)}</span>
      </div>

      <div className='cart-btns'>
        <button
          className="clear-cart"
          onClick={() => dispatch({ type: 'CLEAR_CART' })}
          disabled={state.items.length === 0}
        >
          Clear Cart
        </button>
        <button
          className="checkout"
          onClick={handleCheckout}
          disabled={state.items.length === 0}
        >
          Checkout
        </button>
      </div>
    </div>
  );
};

export default Cart;
