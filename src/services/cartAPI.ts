import type { CartItem } from '../types/cart';

// Type guard function to validate cart item structure
const isValidCartItem = (item: unknown): item is CartItem => {
  return (
    typeof item === 'object' &&
    item !== null &&
    typeof (item as CartItem).id === 'string' &&
    typeof (item as CartItem).name === 'string' &&
    typeof (item as CartItem).price === 'number' &&
    typeof (item as CartItem).priceId === 'string' &&
    typeof (item as CartItem).quantity === 'number' &&
    typeof (item as CartItem).image === 'string' &&
    (item as CartItem).quantity > 0
  );
};

export const fetchUserCart = async (userId: string): Promise<CartItem[]> => {
  try {
    if (!userId) {
      throw new Error('User ID is required');
    }

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Mock: Use localStorage with user prefix for demo
    const savedCart = localStorage.getItem(`user_cart_${userId}`);

    if (!savedCart) {
      return [];
    }

    const parsedData: unknown = JSON.parse(savedCart);

    // Validate that parsed data is an array
    if (!Array.isArray(parsedData)) {
      console.warn('Invalid cart data found (not an array), returning empty cart');
      localStorage.removeItem(`user_cart_${userId}`); // Clean up bad data
      return [];
    }

    // Filter and validate each item using type guard
    const validCartItems = parsedData.filter(isValidCartItem);

    if (validCartItems.length !== parsedData.length) {
      console.warn(`Filtered out ${parsedData.length - validCartItems.length} invalid cart items`);
      // Save the cleaned data back
      localStorage.setItem(`user_cart_${userId}`, JSON.stringify(validCartItems));
    }

    return validCartItems;
  } catch (error) {
    console.error('Error fetching user cart:', error);
    // Clean up corrupted data
    localStorage.removeItem(`user_cart_${userId}`);
    return []; // Return empty cart on error
  }
};

export const saveUserCart = async (userId: string, cartItems: CartItem[]): Promise<void> => {
  try {
    if (!userId) {
      throw new Error('User ID is required');
    }

    if (!Array.isArray(cartItems)) {
      throw new Error('Cart items must be an array');
    }

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));

    // Mock: Save to localStorage with user prefix
    localStorage.setItem(`user_cart_${userId}`, JSON.stringify(cartItems));

    console.log('Cart saved for user:', userId, cartItems);
  } catch (error) {
    console.error('Error saving user cart:', error);
    throw error; // Re-throw so caller knows it failed
  }
};
