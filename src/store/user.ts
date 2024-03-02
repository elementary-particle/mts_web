import { defineStore } from "pinia";

import moeApi from "@/domain/services/moe";

export type RootState = {
  id: string | null;
  isAdmin: boolean;
};

export const useUserStore = defineStore({
  id: "user",
  state: () =>
    ({
      id: null,
      isAdmin: false,
    }) as RootState,
  actions: {
    check() {
      moeApi
        .checkClaim()
        .then(({ id, isAdmin }) => {
          this.$patch({ id, isAdmin });
        })
        .catch((e) => {
          if (e.response && e.response.status == 403) {
            this.$patch({ id: null, isAdmin: false });
          }
        });
    },
  },
});
