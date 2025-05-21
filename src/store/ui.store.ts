import { create } from 'zustand';

interface UIState {
  isLoading: boolean;
  error: string | null;
  successMessage: string | null;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setSuccessMessage: (message: string | null) => void;
  resetState: () => void;
}

const useUIStore = create<UIState>((set) => ({
  isLoading: false,
  error: null,
  successMessage: null,
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  setSuccessMessage: (message) => set({ successMessage: message }),
  resetState: () => set({ isLoading: false, error: null, successMessage: null }),
}));

export default useUIStore;