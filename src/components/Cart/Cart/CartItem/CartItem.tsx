import type { CartItem as CartItemType } from '../../../../types/cart';
import { useCart } from '../../../../hooks/useCart';
import './CartItem.scss';

interface Props {
  item: CartItemType;
}

export const CartItem: React.FC<Props> = ({ item }) => {
  const { dispatch } = useCart();

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        marginBottom: '1rem',
        gap: '0.5rem',
      }}
    >
      <img src={item.image} alt={item.name} style={{ width: '50px', height: '50px', objectFit: 'cover' }} />
      <div style={{ flexGrow: 1 }}>
        <div>{item.name}</div>
        <div>Qty: {item.quantity}</div>
        <div>${(item.price / 100).toFixed(2)}</div>
      </div>
      <button onClick={() => dispatch({ type: 'REMOVE_ITEM', payload: item.id })}>×</button>
    </div>
  );
};
