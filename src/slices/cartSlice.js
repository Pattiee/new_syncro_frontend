import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { createNewOrder } from '../services/order.service'
import toast from "react-hot-toast";


const initialState = {
    items: [], // [{id, name, price, quantity, imageUrl}]
    loading: false,
    error: null,
}


export const placeOrder = createAsyncThunk('cart/placeOrder', async (orderData, { rejectWithValue }) => {
        try {
            const response = await createNewOrder(orderData);
            console.log("RESPONSE: ", response);
            toast.success("Order placed successfully");
            return response.data;
        } catch (err) {
            console.error("ERROR: ", err);
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
            if (!item.id) {
                toast.error("Invalid action");
                return;
            }
            const existingItem = state.items.find(i => i.id === item.id);
            const quantityToAddToCart = item.quantity ?? 1;

            if (existingItem) {
                existingItem.quantity += quantityToAddToCart;
            } else {
                state.items.push({ ...item, quantity: quantityToAddToCart, });
                toast.success(`${item?.name} added to your cart!`);
            }
        },
        decrementCartItemQuantity(state, action) {
            const itemId = action.payload;
            if (!itemId) return;

            const existingItem = state.items.find(i => i.id === itemId);

            if (existingItem) {
                const quantityToDecrementFromCart = 1;
                if (existingItem.quantity <= quantityToDecrementFromCart) {
                    state.items = state.items.filter(item => item.id !== itemId);
                } else {
                    existingItem.quantity -= quantityToDecrementFromCart;
                }
            }  
        },
        removeItem(state, action) {
            state.items = state.items.filter(item => item.id !== action.payload);
            toast.success('Removed');
        },
        clearCart(state) {
            state.items = [];
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(placeOrder.pending, (state) => {
                state.loading = true;
            })
            .addCase(placeOrder.fulfilled, (state, action) => {
                state.loading = false;
                state.items = [];
            })
            .addCase(placeOrder.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

    }
});

export const { addItem, decrementCartItemQuantity, removeItem, clearCart } = cartSlice.actions;
export default cartSlice.reducer;