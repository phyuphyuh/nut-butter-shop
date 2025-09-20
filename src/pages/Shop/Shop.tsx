import { useEffect, useState } from 'react';
import type { StripeProduct } from '../../types/product';
import { useCart } from '../../hooks/useCart';

const Shop: React.FC = () => {
  const [products, setProducts] = useState<StripeProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { dispatch } = useCart();

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
    <div style={{ padding: '2rem' }}>
      <h1>Shop</h1>
      <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))' }}>
        {products.map(product => (
          <div key={product.id} style={{ border: '1px solid #ccc', padding: '1rem' }}>
            <img src={product.images[0]} alt={product.name} style={{ width: '100%', height: '150px', objectFit: 'cover' }} />
            <h2>{product.name}</h2>
            <p>${(product.default_price.unit_amount / 100).toFixed(2)}</p>
            <button
              onClick={() =>
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
                })
              }
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Shop;
