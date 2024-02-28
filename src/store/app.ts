// Utilities
import { defineStore } from "pinia";

export const useAppStore = defineStore("app", {
  state: () => ({
    signInOpened: false,
    signUpOpened: false,
    userId: null as string | null,
  }),
  actions: {
    openSignInDialog() {
      this.signUpOpened = false;
      this.signInOpened = true;
    },
    openSignUpDialog() {
      this.signInOpened = false;
      this.signUpOpened = true;
    },
    closeAccountDialog() {
      this.signInOpened = false;
      this.signUpOpened = false;
    },
  },
});
