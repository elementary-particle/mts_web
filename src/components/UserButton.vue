<template>
  <sign-in-dialog
    v-model="signIn"
    @click:sign-up="
      () => {
        signIn = false;
        signUp = true;
      }
    "
  ></sign-in-dialog>
  <sign-up-dialog
    v-model="signUp"
    @click:sign-in="
      () => {
        signUp = false;
        signIn = true;
      }
    "
  ></sign-up-dialog>
  <v-btn
    icon
    @click="
      () => {
        signUp = false;
        signIn = true;
      }
    "
    v-if="!user.id"
  >
    <v-icon :icon="mdiAccount" />
  </v-btn>
  <v-menu min-width="200px" rounded v-if="user.id">
    <template v-slot:activator="{ props }">
      <v-btn icon v-bind="props">
        <v-avatar color="primary">
          <span class="text-h5">{{ nameAbbrev }}</span>
        </v-avatar>
      </v-btn>
    </template>
    <v-card width="250" flat rounded="0">
      <v-card-text>
        <div class="mx-auto text-left">
          <v-row>
            <v-col cols="3">
              <v-avatar color="primary">
                <span class="text-h5">{{ nameAbbrev }}</span>
              </v-avatar>
            </v-col>
            <v-col>
              <h3>{{ name }}</h3>
              <p class="text-caption mt-1">email@sample.com</p>
            </v-col>
          </v-row>
        </div>
      </v-card-text>
      <v-divider />
      <v-list flat rounded="0">
        <v-list-item @click="null">
          <v-list-item-title>{{ t("settings") }}</v-list-item-title>
        </v-list-item>
        <v-list-item
          @click="
            () => {
              moeApi.signOut().then(() => {
                user.check();
              });
            }
          "
        >
          <v-list-item-title>{{ t("signOut") }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-card>
  </v-menu>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useI18n } from "vue-i18n";

import { useUserStore } from "@/store/user";
import moeApi from "@/domain/services/moe";
import { watchEffect } from "vue";
import { mdiAccount } from "@mdi/js";

const user = useUserStore();

const { t } = useI18n({
  messages: {
    en: {
      settings: "Settings",
      signOut: "Sign Out",
    },
    zhHans: {
      settings: "设置",
      signOut: "登出",
    },
  },
});

const signIn = ref(false);
const signUp = ref(false);

const name = ref("");
const nameAbbrev = ref("");

user.$subscribe(
  (_, state) => {
    if (state.id) {
      moeApi.userById(state.id).then(({ name: name_ }) => {
        name.value = name_;
      });
    } else {
      name.value = "";
    }
  },
  { immediate: true },
);

watchEffect(() => {
  const firstChar = name.value.length > 0 ? name.value[0] : "";
  nameAbbrev.value = firstChar.toUpperCase();
});
</script>
