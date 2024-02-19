<template>
  <v-overlay v-model="model" contained class="align-center justify-center">
    <v-progress-circular
      color="primary"
      indeterminate
      size="64"
    ></v-progress-circular>
  </v-overlay>
</template>

<script setup lang="ts">
const model = defineModel({ default: false });
</script>
