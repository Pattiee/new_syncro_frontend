import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { createNewOrder } from '../services/order.service'
import toast from "react-hot-toast";


const initialState = {
    items: [], // [{id, name, price, quantity}]
    loading: false,
    error: null,
}


export const placeOrder = createAsyncThunk(
    'cart/placeOrder',
    async (orderData, { rejectWithValue }) => {
        try {
            const response = await createNewOrder(orderData);
            toast.success("Order placed successfully");
            return response.data;
        } catch (err) {
            toast.error("Error placing order");
            return rejectWithValue(err?.response?.data);
        }
    }
);

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addItem(state, action) {
            const item = action.payload;
            const existingItem = state.items.find(i => i.productId === item.productId);
            const quantityToAddToCart = item.quantity || 1;

            if (existingItem) {
                existingItem.quantity += quantityToAddToCart;
            } else {
                state.items.push({ ...item, quantity: quantityToAddToCart });
            }
        },
        removeItem(state, action) {
            alert('Remove item from cart?.');
            state.items = state.items.filter(item => item.productId !== action.payload);
        },
        clearCart(state) {
            state.items = [];
            state.items.length === 0 ? toast.success('Cart cleared.') : toast.error('Failed to clear your cart.');
        }
    },
    extraReducers: (builder) => {
        builder.addCase('placeOrder/pending', (state) => {
            state.loading = true;
        }).addCase('placeOrder/fulfilled', (state, action) => {
            state.loading = false;
            state.items = [];
        }).addCase('placeOrder/rejected', (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
    }
});

export const { addItem, removeItem, clearCart } = cartSlice.actions;
export default cartSlice.reducer;