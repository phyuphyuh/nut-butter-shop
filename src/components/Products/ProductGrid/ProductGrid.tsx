import type { StripeProduct } from '../../../types/product';
import ProductCard from '../ProductCard/ProductCard';
import './ProductGrid.scss';

interface Props {
  products: StripeProduct[];
}

const ProductGrid: React.FC<Props> = ({ products }) => {
  return (
    <div className='product-grid'>
      <div className="products-row">
        {products.map((product, index) => (
          <ProductCard key={product.id} product={product} index={index} />
        ))}
      </div>
    </div>
  );
};

export default ProductGrid;
