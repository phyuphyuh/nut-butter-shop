import { useState, useEffect, useRef } from 'react';
import { useCart } from '../../../../hooks/useCart';
import Cart from '../Cart';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartShopping } from '@fortawesome/free-solid-svg-icons';
import './CartIcon.scss';

const CartIcon: React.FC = () => {
  const { state } = useCart();
  const [open, setOpen] = useState(false);
  const [animate, setAnimate] = useState(false);
  const cartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (state.itemCount > 0) {
      setAnimate(true);
      const timer = setTimeout(() => setAnimate(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [state.itemCount]);

  // Close cart when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (cartRef.current && !cartRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleCart = () => setOpen(prev => !prev);

  return (
    <div className="cart-wrapper" ref={cartRef}>
      <div
        className={`cart-icon ${animate ? 'animate' : ''}`}
        onClick={toggleCart}
        aria-label={`Shopping cart with ${state.itemCount} items`}
      >
        <FontAwesomeIcon icon={faCartShopping} />
        {state.itemCount > 0 && <span className="num">{state.itemCount}</span>}
      </div>

      {open && (
        <div className="cart-dropdown">
          <Cart />
        </div>
      )}
    </div>
  );
};

export default CartIcon;
