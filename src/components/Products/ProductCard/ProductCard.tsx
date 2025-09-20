import type { StripeProduct } from '../../../types/product';
import AddToCartButton from '../AddToCardButton/AddToCartButton';
import './ProductCard.scss';

interface Props {
  product: StripeProduct;
  index: number;
}

const ProductCard: React.FC<Props> = ({ product, index }) => {
  const nutClass = product.metadata?.category || 'default';

  return (
    <div className={`product-item ${index % 2 === 0 ? 'even' : 'odd'}`}>
      {/* Nut overlay image */}
      <img
        className={`nut-img ${nutClass}`}
        src={`/images/${nutClass}.png`}
        alt={`${nutClass} overlay`}
      />

      {/* Product image from Stripe */}
      <img
        className="product-img"
        src={product.images[0]}
        alt={product.name}
      />

      <div className="description">
        <div className="name">{product.name}</div>
        <div className="size">({(product.default_price.unit_amount / 100).toFixed(0)} oz)</div>
        <div className="price">${(product.default_price.unit_amount / 100).toFixed(2)}</div>
        <AddToCartButton product={product} />
      </div>
    </div>
  );
};

export default ProductCard;
