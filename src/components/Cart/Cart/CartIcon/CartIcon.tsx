import { useState, useEffect } from 'react';
import { useCart } from '../../../../hooks/useCart';
import Cart from '../Cart';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartShopping } from '@fortawesome/free-solid-svg-icons';
import './CartIcon.scss';

const CartIcon: React.FC = () => {
  const { state } = useCart();
  const [open, setOpen] = useState(false);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (state.itemCount > 0) {
      setAnimate(true);
      const timer = setTimeout(() => setAnimate(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [state.itemCount]);

  return (
    <div className="cart-wrapper">
      <div className={`cart-icon ${animate ? 'animate' : ''}`} onClick={() => setOpen(prev => !prev)}>
        <FontAwesomeIcon icon={faCartShopping} />
        {state.itemCount > 0 && <span className="num">{state.itemCount}</span>}
      </div>

      {open && (
        <Cart />
      )}
    </div>
  );
};

export default CartIcon;
