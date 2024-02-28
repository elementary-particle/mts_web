<template>
  <unit :id="route.params.id"></unit>
</template>

<route lang="yaml">
meta:
  layout: window
</route>

<script setup lang="ts">
import { useRoute } from "vue-router";

const route = useRoute();
</script>
