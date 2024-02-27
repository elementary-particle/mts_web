// Utilities
import { defineStore } from "pinia";

export const useAppStore = defineStore("app", {
  state: () => ({
    signInOpened: false,
    signUpOpened: false,
    userId: null as string | null,

    snackBarTitle: "",
    snackBarContent: "",
    snackBarTimeout: 1500,
    snackBarType: undefined as
      | "error"
      | "success"
      | "warning"
      | "info"
      | undefined,
    snackBarOpened: false,
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
    callUpSnackbar(
      _title: string,
      _content: string,
      _type: "error" | "success" | "warning" | "info" | undefined,
      _timeout: number = 1500,
    ) {
      this.snackBarTitle = _title;
      this.snackBarContent = _content;
      this.snackBarType = _type;
      this.snackBarTimeout = _timeout;

      this.snackBarOpened = true;
    },
  },
});
