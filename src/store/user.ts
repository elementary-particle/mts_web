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
      moeApi.checkClaim().then((claim) => {
        if (claim) {
          const { id, isAdmin } = claim;
          this.$patch({ id, isAdmin });
        } else {
          this.$patch({ id: null, isAdmin: false });
        }
      });
    },
  },
});
