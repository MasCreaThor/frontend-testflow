import { create } from 'zustand';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

const initialState: LoadingState = {
  isLoading: false,
  error: null,
  setLoading: function (loading: boolean): void {
    throw new Error('Function not implemented.');
  },
  setError: function (error: string | null): void {
    throw new Error('Function not implemented.');
  },
  clearError: function (): void {
    throw new Error('Function not implemented.');
  }
};

const loadingSlice = createSlice({
  name: 'loading',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const { setLoading, setError, clearError } = loadingSlice.actions;
export const loadingReducer = loadingSlice.reducer;

interface LoadingState {
  isLoading: boolean;
  error: string | null;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

const useLoadingStore = create<LoadingState>((set) => ({
  isLoading: false,
  error: null,
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),
}));

export default useLoadingStore;