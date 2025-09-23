import { useCart } from '../../../hooks/useCart';
import { CartItem } from './CartItem/CartItem';
import CheckoutButton from '../../Checkout/CheckoutButton';
import './Cart.scss';

const Cart: React.FC = () => {
  const { state, dispatch } = useCart();

  const { total } = state;

  return (
    <div className="cart">
      <ul className="cart-list">
        {state.items.length === 0 ? (
          <li className="none">Your cart is empty.</li>
        ) : (
          state.items.map((item) => <CartItem key={item.id} item={item} />)
        )}
      </ul>

      <div className="cart-totals">
        <span>Subtotal:</span>
        <span>${(total / 100).toFixed(2)}</span>
      </div>

      <button
        className="clear-cart"
        onClick={() => dispatch({ type: 'CLEAR_CART' })}
        disabled={state.items.length === 0}
      >
        Clear Cart
      </button>

      <div className="cart-btns">
        <CheckoutButton />
      </div>
    </div>
  );
};

export default Cart;
