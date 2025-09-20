import { useEffect, useState } from 'react';
import type { StripeProduct } from '../../types/product';
import ProductGrid from '../../components/Products/ProductGrid/ProductGrid';
import './Shop.scss';

const Shop: React.FC = () => {
  const [products, setProducts] = useState<StripeProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/.netlify/functions/get-products');
        if (!res.ok) throw new Error('Failed to fetch products');
        const data = await res.json();
        setProducts(data.products);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (loading) return <div>Loading products...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className='shop-page'>
      <div className="shop-header-img"></div>

      <div className="shop-header">
        <h1>Scoop, spread, drizzle, dip, mix, blend, bake</h1>
        <p>or simply sit down with your fav jar(s) and eat 'em straight up!</p>
      </div>

      <hr className="solidline"></hr>

      <ProductGrid products={products} />
   </div>
  );
};

export default Shop;
