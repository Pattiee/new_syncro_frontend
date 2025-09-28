import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { createNewOrder } from "../services/order.service";
import toast from "react-hot-toast";

// Initial state
const initialState = {
  items: [], // [{id, name, price, quantity, imageUrl}]
  loading: false,
  error: null,
};

// Async thunk: place order
export const placeOrder = createAsyncThunk(
  "cart/placeOrder",
  async (orderData, { rejectWithValue }) => {
    try {
      const response = await createNewOrder(orderData);
      toast.success("Order placed successfully");
      return response.data;
    } catch (err) {
      console.error("placeOrder error:", err);
      toast.error("Error placing order");
      return rejectWithValue(err?.response?.data || { message: "Unknown error" });
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setCart: (state, action) => {
      state.items = action.payload?.items || [];
    },
    addItem: (state, action) => {
      const item = action.payload;
      if (!item?.id) {
        toast.error("Invalid item");
        return;
      }
      const existingItem = state.items.find((i) => i.id === item.id);
      const quantityToAdd = item.quantity ?? 1;

      if (existingItem) {
        existingItem.quantity += quantityToAdd;
      } else {
        state.items.push({ ...item, quantity: quantityToAdd });
        toast.success(`${item?.name} added to your cart!`);
      }
    },
    decrementCartItemQuantity: (state, action) => {
      const itemId = action.payload;
      if (!itemId) return;

      const existingItem = state.items.find((i) => i.id === itemId);
      if (existingItem) {
        if (existingItem.quantity <= 1) {
          state.items = state.items.filter((item) => item.id !== itemId);
        } else {
          existingItem.quantity -= 1;
        }
      }
    },
    removeItem: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    clearCart: (state) => {
      state.items = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(placeOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(placeOrder.fulfilled, (state) => {
        state.loading = false;
        state.items = [];
      })
      .addCase(placeOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
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