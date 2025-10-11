import { createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";

const initialState = {
  items: [], // [{id, name, unitPrice, qty}]
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setCart: (state, action) => {
      state.items = action.payload?.items || [];
    },
    addItem: (state, action) => {
      const item = action.payload;
      if (!item?.id) return toast.error("Invalid item");

      const existingItem = state.items.find(i => i.id === item.id);
      const quantityToAdd = item.qty ?? 1;

      if (existingItem) {
        existingItem.qty += quantityToAdd;
      } else {
        state.items.push({ ...item, qty: quantityToAdd });
        toast.success(`${item?.name} added to your cart!`);
      }
    },
    decrementCartItemQuantity: (state, action) => {
      const itemId = action.payload;
      const existingItem = state.items.find(i => i.id === itemId);
      if (existingItem) {
        if (existingItem.qty <= 1) {
          state.items = state.items.filter(item => item.id !== itemId);
        } else {
          existingItem.qty -= 1;
        }
      }
    },
    removeItem: (state, action) => {
      state.items = state.items.filter(item => item.id !== action.payload);
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