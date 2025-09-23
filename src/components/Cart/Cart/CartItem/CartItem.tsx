import type { CartItem as CartItemType } from '../../../../types/cart';
import { useCart } from '../../../../hooks/useCart';
import './CartItem.scss';

interface Props {
  item: CartItemType;
}

export const CartItem: React.FC<Props> = ({ item }) => {
  const { dispatch } = useCart();

  const handleQuantityDecrease = () => {
    const newQuantity = Math.max(0, item.quantity - 1);
    dispatch({
      type: "UPDATE_QUANTITY",
      payload: { id: item.id, quantity: newQuantity },
    });
  };

  const handleQuantityIncrease = () => {
    dispatch({
      type: "UPDATE_QUANTITY",
      payload: { id: item.id, quantity: item.quantity + 1 }
    });
  };

  const handleRemoveItem = () => {
    dispatch({ type: 'REMOVE_ITEM', payload: item.id });
  };

  return (
    <li className='cart-item'>
      <img className='cart-img' src={item.image} alt={item.name} />
      <div>
        <div className='cart-name'>{item.name}</div>
        <div className="cart-quantity">
          <button
            onClick={handleQuantityDecrease}
            disabled={item.quantity <= 1}
            aria-label="Decrease quantity"
          >
            –
          </button>

          <span>{item.quantity}</span>

          <button
            onClick={handleQuantityIncrease}
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>
      </div>
      <div>
        <div className='cart-price'>${(item.price / 100).toFixed(2)}</div>
        <button
          className='remove-item'
          onClick={handleRemoveItem}
          aria-label={`Remove ${item.name} from cart`}
        >
          REMOVE
        </button>
      </div>
    </li>
  );
};
