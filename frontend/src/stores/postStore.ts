import { create } from "zustand";

interface TempPostState {
  tempTitle: string;
  tempContent: string;
  setTempTitle: (title: string) => void;
  setTempContent: (content: string) => void;
  clearTempPost: () => void;
}
export const useTempPostStore = create<TempPostState>((set) => ({
  tempTitle: '',
  tempContent: '',
  setTempTitle: (title) => set({ tempTitle: title }),
  setTempContent: (content) => set({ tempContent: content }),
  clearTempPost: () => set({ tempTitle: '', tempContent: '' }),
}));