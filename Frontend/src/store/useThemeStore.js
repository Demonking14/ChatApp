import { create } from 'zustand';

export const useThemeStore = create((set) => ({
  theme: localStorage.getItem("ChatyFiTheme") || "coffee",

  setTheme: (newTheme) => {localStorage.setItem("ChatyFiTheme", newTheme);
    set(() => ({ theme: newTheme }))},
}));
