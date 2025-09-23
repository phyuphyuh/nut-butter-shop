import { useReducer, useEffect, useRef } from "react";
import type { CartState, CartAction } from "../types/cart";
import { CartContext } from "./CartContext";
import { useAuth0 } from '@auth0/auth0-react';
import { calculateTotals } from "../utils/calculations";
import type { CartItem } from "../types/cart";
import { fetchUserCart, saveUserCart } from "../services/cartAPI";

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      const existingItem = state.items.find(item => item.id === action.payload.id);
      let updatedItems;

      if (existingItem) {
        updatedItems = state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: item.quantity + action.payload.quantity }
            : item
        );
      } else {
        updatedItems = [...state.items, action.payload];
      }

      return { ...state, items: updatedItems, ...calculateTotals(updatedItems) };
    }

    case "REMOVE_ITEM": {
      const updatedItems = state.items.filter(item => item.id !== action.payload);
      return { ...state, items: updatedItems, ...calculateTotals(updatedItems) };
    }

    case "UPDATE_QUANTITY": {
      const updatedItems = state.items
        .map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        )
        .filter(item => item.quantity > 0);
      return { items: updatedItems, ...calculateTotals(updatedItems) };
    }

    case "CLEAR_CART":
      return { items: [], itemCount: 0, total: 0 };

    case "LOAD_CART": {
      const updatedItems = action.payload;
      return { items: updatedItems, ...calculateTotals(updatedItems) };
    }

    case "MERGE_CART": {
      const guestItems = state.items;
      const userItems = action.payload;

      // Merge logic: combine quantities for same items
      const mergedItems = [...userItems];

      guestItems.forEach(guestItem => {
        const existingIndex = mergedItems.findIndex(item => item.id === guestItem.id);
        if (existingIndex >= 0) {
          mergedItems[existingIndex].quantity += guestItem.quantity;
        } else {
          mergedItems.push(guestItem);
        }
      });

      return { items: mergedItems, ...calculateTotals(mergedItems) };
    }

    default:
      return state;
  }
}

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user, isAuthenticated, isLoading } = useAuth0();
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    itemCount: 0,
    total: 0,
  });

  // Track if cart migration has already happened for this user
  const hasMigratedRef = useRef<string | null>(null);

  // Load guest cart from localStorage on mount
  useEffect(() => {
    if (isLoading) return;

    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      try {
        const items: CartItem[] = JSON.parse(savedCart);
        dispatch({ type: "LOAD_CART", payload: items });
      } catch (error) {
        console.error('Error parsing saved cart:', error);
        localStorage.removeItem("cart");
      }
    }
  }, [isLoading]);

  // Handle cart migration when user logs in
  useEffect(() => {
    if (!isLoading && isAuthenticated && user?.sub && hasMigratedRef.current !== user.sub) {
      // Mark this user as migrated to prevent re-runs
      hasMigratedRef.current = user.sub;

      const handleCartMigration = async () => {
        try {
          // Capture guest cart at the time of migration
          const guestCart = state.items;

          // Fetch user's saved cart
          const userCart: CartItem[] = await fetchUserCart(user.sub!);

          if (guestCart.length > 0) {
            // Merge guest cart with user cart
            const mergedItems = [...userCart];
            guestCart.forEach(guestItem => {
              const existingIndex = mergedItems.findIndex(item => item.id === guestItem.id);
              if (existingIndex >= 0) {
                mergedItems[existingIndex].quantity += guestItem.quantity;
              } else {
                mergedItems.push(guestItem);
              }
            });

            // Update state with merged cart
            dispatch({ type: "LOAD_CART", payload: mergedItems });

            // Save merged cart back to user profile
            await saveUserCart(user.sub!, mergedItems);

            // Clear guest cart from localStorage
            localStorage.removeItem("cart");
          } else if (userCart.length > 0) {
            // Load user's saved cart
            dispatch({ type: "LOAD_CART", payload: userCart });
          }
        } catch (error) {
          console.error('Error migrating cart:', error);
        }
      };

      handleCartMigration();
    }
  }, [isAuthenticated, user?.sub, isLoading, state.items]);

  // Reset migration tracking when user logs out
  useEffect(() => {
    if (!isAuthenticated) {
      hasMigratedRef.current = null;
    }
  }, [isAuthenticated]);

  // Save to localStorage and user profile
  useEffect(() => {
    if (isLoading) return;

    // Always save to localStorage as backup
    localStorage.setItem("cart", JSON.stringify(state.items));

    // For authenticated users, also save to their profile
    if (isAuthenticated && user?.sub) {
      // Debounced save to user profile
      const timeoutId = setTimeout(async () => {
        try {
          await saveUserCart(user.sub!, state.items);
        } catch (error) {
          console.error('Error saving cart to user profile:', error);
        }
      }, 1000);

      return () => clearTimeout(timeoutId);
    }
  }, [state.items, isAuthenticated, user?.sub, isLoading]);

  return (
    <CartContext.Provider value={{ state, dispatch }}>
      {children}
    </CartContext.Provider>
  );
};
