<template>
  <v-app>
    <sign-in-dialog
      v-model="app.signInOpened"
      @click:sign-up="app.openSignUpDialog"
    ></sign-in-dialog>
    <sign-up-dialog
      v-model="app.signUpOpened"
      @click:sign-in="app.openSignInDialog"
    ></sign-up-dialog>

    <default-bar />

    <default-view />
  </v-app>
</template>

<script lang="ts" setup>
import DefaultBar from "./default/AppBar.vue";
import DefaultView from "./default/View.vue";

import { onMounted } from "vue";
import { useI18n } from "vue-i18n";

import { useAppStore } from "@/store/app";

const app = useAppStore();

const { locale } = useI18n();

onMounted(async () => {
  let l: string = localStorage.lang ? localStorage.lang : navigator.language;
  if (l.startsWith("zh")) {
    locale.value = "zhHans";
  } else if (l.startsWith("en")) {
    locale.value = "en";
  }
});
</script>
