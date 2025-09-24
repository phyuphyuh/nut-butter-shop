interface StripeOrder {
  id: string;
  amount: number;
  currency: string;
  status: string;
  created: number;
  customer_email: string;
  items: Array<{
    name: string;
    quantity: number;
    amount: number;
    images: string[];
  }>;
}

export const fetchUserOrdersFromStripe = async (userEmail: string, customerId?: string): Promise<StripeOrder[]> => {
  try {
    console.log('Fetching orders from Stripe API with:', { userEmail, customerId });

    const params = new URLSearchParams();
    if (customerId) {
      params.append('customer_id', customerId);
    } else if (userEmail) {
      params.append('email', userEmail);
    } else {
      throw new Error('Either customer ID or email is required');
    }

    const response = await fetch(`/.netlify/functions/get-customer-orders?${params}`);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    console.log('Stripe API response:', data);

    return data.orders || [];
  } catch (error) {
    console.error('Error fetching orders from Stripe:', error);
    return [];
  }
};
