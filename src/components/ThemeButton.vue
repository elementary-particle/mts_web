<template>
  <v-btn icon @click="theme.toggle">
    <v-icon v-if="theme.isLight" :icon="mdiWeatherSunny" />
    <v-icon v-if="theme.isDark" :icon="mdiWeatherNight" />
  </v-btn>
</template>

<script setup lang="ts">
import { useThemeStore } from "@/store/theme";
import { mdiWeatherNight, mdiWeatherSunny } from "@mdi/js";

const theme = useThemeStore();
</script>
