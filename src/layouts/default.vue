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

    <v-snackbar
      v-model="app.snackBarOpened"
      :color="app.snackBarType"
      :timeout="app.snackBarTimeout"
    >
      <v-alert
        :type="app.snackBarType"
        :title="app.snackBarTitle"
        :text="app.snackBarContent"
      ></v-alert>
    </v-snackbar>
  </v-app>
</template>

<script lang="ts" setup>
import DefaultBar from "./default/AppBar.vue";
import DefaultView from "./default/View.vue";

import { useAppStore } from "@/store/app";

const app = useAppStore();
</script>
