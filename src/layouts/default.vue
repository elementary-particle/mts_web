<template>
  <v-app>
    <snackbar-queue />

    <default-bar />

    <default-view />
  </v-app>
</template>

<script lang="ts" setup>
import SnackbarQueue from "@/components/SnackbarQueue.vue";
import DefaultBar from "./default/AppBar.vue";
import DefaultView from "./default/View.vue";
</script>
