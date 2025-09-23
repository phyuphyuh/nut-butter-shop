export interface CartItem {
  id: string;
  name: string;
  price: number;
  priceId: string;
  quantity: number;
  image: string;
}

export interface CartState {
  items: CartItem[];
  itemCount: number;
  total: number;
}

export type CartAction =
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'LOAD_CART'; payload: CartItem[] }
  | { type: 'MERGE_CART'; payload: CartItem[] };
