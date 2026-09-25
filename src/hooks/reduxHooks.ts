import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import type { RootState, AppDispatch } from '../store'; // Adjust this relative path to point to your store file

// 1. Fully-typed wrap for the native application Dispatch mechanism
export const useAppDispatch = () => useDispatch<AppDispatch>();

// 2. Fully-typed selector template contract mapping your clean rootState tree 
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;