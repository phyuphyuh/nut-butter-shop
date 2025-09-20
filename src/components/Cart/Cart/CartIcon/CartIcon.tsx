import { useState } from 'react';
import { useCart } from '../../../../hooks/useCart';
import Cart from '../Cart';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartShopping } from '@fortawesome/free-solid-svg-icons';
import './CartIcon.scss';

const CartIcon: React.FC = () => {
  const { state } = useCart();
  const [open, setOpen] = useState(false);

  return (
    <div className="cart-wrapper">
      <div className="cart-icon" onClick={() => setOpen(prev => !prev)}>
        <FontAwesomeIcon icon={faCartShopping} />
        {state.itemCount > 0 && <span className="num">{state.itemCount}</span>}
      </div>

      {open && (
        <div className="shopping-cart">
          <Cart />
        </div>
      )}
    </div>
  );
};

export default CartIcon;
