import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import toast from "react-hot-toast";

// 1. Define explicit structure contracts for a Single Cart Item
export interface CartItem {
  id: string | number;
  name: string;
  unit_price: number;
  qty: number;
  [key: string]: any; // Catch-all for extra item parameters like imageUrls
}

export interface CartState {
  items: CartItem[];
}

const initialState: CartState = {
  items: [],
};

// 2. Define targeted input payload structures for mutations
export interface AddItemPayload {
  id: string | number;
  name: string;
  unit_price: number;
  qty?: number;
  [key: string]: any;
}

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setCart: (state, action: PayloadAction<{ items: CartItem[] } | undefined>) => {
      state.items = action.payload?.items || [];
    },
    addItem: (state, action: PayloadAction<AddItemPayload>) => {
      const item = action.payload;
      if (!item?.id) {
        toast.error("Invalid item");
        return;
      }

      const existingItem = state.items.find((i) => i.id === item.id);
      const quantityToAdd = item.qty ?? 1;

      if (existingItem) {
        existingItem.qty += quantityToAdd;
      } else {
        // Enforce the default fallback qty while spreading payload parameters
        state.items.push({ ...item, qty: quantityToAdd } as CartItem);
        toast.success(`${item?.name} added to your cart!`);
      }
    },
    decrementCartItemQuantity: (state, action: PayloadAction<string | number>) => {
      const itemId = action.payload;
      const existingItem = state.items.find((i) => i.id === itemId);
      
      if (existingItem) {
        if (existingItem.qty <= 1) {
          state.items = state.items.filter((item) => item.id !== itemId);
        } else {
          existingItem.qty -= 1;
        }
      }
    },
    removeItem: (state, action: PayloadAction<string | number>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    clearCart: (state) => {
      state.items = [];
    },
  },
});

export const {
  setCart,
  addItem,
  decrementCartItemQuantity,
  removeItem,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;

// 3. Strongly-Typed Selectors Framework
type ExpectedRootState = { cart: CartState; [key: string]: any };

export const selectCartItems = (state: ExpectedRootState): CartItem[] => state?.cart?.items;
export const selectCartCount = (state: ExpectedRootState): number => 
  state?.cart?.items?.reduce((total, item) => total + item.qty, 0) || 0;
export const selectCartTotal = (state: ExpectedRootState): number => 
  state?.cart?.items?.reduce((total, item) => total + (item.unit_price * item.qty), 0) || 0;