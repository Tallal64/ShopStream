import { create } from "zustand";

export const useTheme = create((set) => ({
  isDarkMode: true,
  setTheme: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
}));
    