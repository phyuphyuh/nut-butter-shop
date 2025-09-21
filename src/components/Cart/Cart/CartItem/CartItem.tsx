import type { CartItem as CartItemType } from '../../../../types/cart';
import { useCart } from '../../../../hooks/useCart';
import './CartItem.scss';

interface Props {
  item: CartItemType;
}

export const CartItem: React.FC<Props> = ({ item }) => {
  const { dispatch } = useCart();

  return (
    <li className='cart-item'>
      <img className='cart-img' src={item.image} alt={item.name} />
      <div>
        <div className='cart-name'>{item.name}</div>
        <div className="cart-quantity">
          <button
            onClick={() =>
              dispatch({
                type: "UPDATE_QUANTITY",
                payload: { id: item.id, quantity: Math.max(0, item.quantity - 1) },
              })
            }
          >
            –
          </button>

          <span>{item.quantity}</span>

          <button
            onClick={() =>
              dispatch({ type: "UPDATE_QUANTITY", payload: { id: item.id, quantity: item.quantity + 1 } })
            }
          >
            +
          </button>
        </div>
      </div>
      <div>
        <div className='cart-price'>${(item.price / 100).toFixed(2)}</div>
        <span className='remove-item' onClick={() => dispatch({ type: 'REMOVE_ITEM', payload: item.id })}>REMOVE</span>
      </div>
    </li>
  );
};
