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
    ><v-icon>mdi-account</v-icon></v-btn
  >
</template>

<script setup lang="ts">
import { ref } from "vue";

const signIn = ref(false);
const signUp = ref(false);
</script>
