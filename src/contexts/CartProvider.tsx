import { useReducer, useEffect } from "react";
import type { CartState, CartAction } from "../types/cart";
import { CartContext } from "./CartContext";
import { calculateTotals } from "../utils/calculations";

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
      const updatedItems = state.items.map(item =>
        item.id === action.payload.id
          ? { ...item, quantity: action.payload.quantity }
          : item
      );
      return { ...state, items: updatedItems, ...calculateTotals(updatedItems) };
    }

    case "CLEAR_CART":
      return { items: [], itemCount: 0, total: 0 };

    case "LOAD_CART": {
      const updatedItems = action.payload;
      return { items: updatedItems, ...calculateTotals(updatedItems) };
    }

    default:
      return state;
  }
}

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    itemCount: 0,
    total: 0,
  });

  // Load from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      const items = JSON.parse(savedCart);
      dispatch({ type: "LOAD_CART", payload: items });
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(state.items));
  }, [state.items]);

  return (
    <CartContext.Provider value={{ state, dispatch }}>
      {children}
    </CartContext.Provider>
  );
};
