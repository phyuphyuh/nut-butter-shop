import { useCart } from '../../../hooks/useCart';
import type { StripeProduct } from '../../../types/product';
import './AddToCartButton.scss';

interface Props {
  product: StripeProduct;
}

const AddToCartButton: React.FC<Props> = ({ product }) => {
  const { dispatch } = useCart();

  const handleAdd = () => {
    dispatch({
      type: 'ADD_ITEM',
      payload: {
        id: product.id,
        name: product.name,
        price: product.default_price.unit_amount,
        priceId: product.default_price.id,
        quantity: 1,
        image: product.images[0],
      },
    });
  };

  return <button className='add-btn' onClick={handleAdd}>Add</button>;
};

export default AddToCartButton;
