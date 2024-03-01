import { defineStore } from "pinia";

export type RootState = {
  locale: string;
};

const getLocale = () =>
  (window && (localStorage.getItem("locale") || navigator.language)) || "en";

export const useLocaleStore = defineStore({
  id: "locale",
  state: () =>
    ({
      locale: getLocale(),
    }) as RootState,
});
