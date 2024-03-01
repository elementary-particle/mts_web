<template>
  <v-btn icon @click="theme.toggle">
    <v-icon v-if="theme.isLight"> mdi-weather-sunny </v-icon>
    <v-icon v-if="theme.isDark"> mdi-weather-night </v-icon>
  </v-btn>
</template>

<script setup lang="ts">
import { useThemeStore } from "@/store/theme";

const theme = useThemeStore();
</script>
