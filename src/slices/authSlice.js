import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getCurrentUser } from "../services/auth.service";


export const checkAuth = createAsyncThunk('auth/checkAuth', async () => {
    const res = await getCurrentUser();
    return res?.data ? res.data : null;
});

const initialState = {
    user: null,
    status: 'idle', // 'loading' | 'succeeded' | 'failed'
    error: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout(state) {
            state.user = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(checkAuth.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(checkAuth.fulfilled, (state, action) => {
                state.user = {
                    username: action.payload?.username || '',
                    name: action.payload?.name || '',
                    roles: action.payload?.roles || [],
                };
                state.status = 'succeeded';
            })
            .addCase(checkAuth.rejected, (state, action) => {
                state.user = null;
                state.status = 'failed';
                state.error = action.error.message;
            });
    }
});

// Actions
export const { logout } = authSlice.actions;

// Reducer
export default authSlice.reducer;

// Selectors
export const selectCurrentUser = state => state.auth?.user;
export const selectAuthStatus = state => state.auth?.status;
export const selectAuthError = state => state.auth?.error;
export const selectIsAuthenticated = state => !!state?.auth?.user;