export interface StripeProduct {
  id: string;
  name: string;
  description: string | null;
  images: string[];
  metadata: Record<string, string>;
  default_price: {
    id: string;
    unit_amount: number;
    currency: string;
  };
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number; // in cents
  priceId: string; // Stripe price ID
  image: string;
  category?: string;
}
