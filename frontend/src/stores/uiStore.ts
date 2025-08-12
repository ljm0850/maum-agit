import { create } from 'zustand';

interface UiState {
  currentPath: string;
  setPath: (path: string) => void;
}

export const useUiStore = create<UiState>((set) => ({
  currentPath: '/',
  setPath: (path: string) => set({ currentPath: path }),
}));