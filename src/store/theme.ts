import { defineStore } from "pinia";

export type RootState = {
  name: "light" | "dark";
};

const getTheme = () =>
  (window &&
    (localStorage.getItem("theme") ||
      (matchMedia("(prefers-color-scheme:dark)").matches
        ? "dark"
        : "light"))) ||
  "light";

export const useThemeStore = defineStore({
  id: "theme",
  state: () =>
    ({
      name: getTheme(),
    }) as RootState,
  getters: {
    isLight: (state) => state.name == "light",
    isDark: (state) => state.name == "dark",
  },
  actions: {
    toggle() {
      if (this.name == "light") {
        this.name = "dark";
      } else if (this.name == "dark") {
        this.name = "light";
      }
    },
  },
});
