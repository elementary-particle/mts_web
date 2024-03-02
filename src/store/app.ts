import { defineStore } from "pinia";

export type Notification = {
  message: string;
  timeout?: number;
  color?: string;
};

export type RootState = {
  notifications: Notification[];
};

export const useAppStore = defineStore("app", {
  state: () =>
    ({
      notifications: [],
    }) as RootState,
  actions: {
    snackbar(message: string, options: Partial<Notification> = {}) {
      this.notifications.push({ message, ...options });
    },
  },
});
