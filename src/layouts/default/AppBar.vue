<template>
  <v-app-bar flat :elevation="2">
    <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
    <v-app-bar-title>{{ t("mts") }}</v-app-bar-title>

    <v-spacer />

    <v-btn icon @click="app.openSignInDialog"
      ><v-icon>mdi-account</v-icon></v-btn
    >
    <v-menu location="bottom">
      <template v-slot:activator="{ props }">
        <v-btn icon v-bind="props">
          <v-icon>mdi-translate</v-icon>
        </v-btn>
      </template>

      <v-list nav>
        <v-list-item
          title="简体中文"
          @click="$i18n.locale = 'zhHans'"
          :active="$i18n.locale == 'zhHans'"
          density="compact"
        ></v-list-item>
        <v-list-item
          title="English"
          @click="$i18n.locale = 'en'"
          :active="$i18n.locale == 'en'"
          density="compact"
        ></v-list-item>
        <v-list-item
          title="More coming soon..."
          density="compact"
          disabled
        ></v-list-item>
      </v-list>
    </v-menu>
    <v-btn icon @click="toggleTheme()">
      <v-icon v-if="theme.global.name.value == 'light'"
        >mdi-weather-sunny</v-icon
      >
      <v-icon v-if="theme.global.name.value == 'dark'"
        >mdi-weather-night</v-icon
      >
    </v-btn>
  </v-app-bar>

  <v-navigation-drawer v-model="drawer" temporary>
    <v-list nav>
      <v-list-item
        title="Home"
        prepend-icon="mdi-home"
        @click="$router.push('/')"
        :active="$route.path.toString() == '/'"
      ></v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useTheme } from "vuetify";
import { useI18n } from "vue-i18n";

import { useAppStore } from "@/store/app";

const { t, locale } = useI18n();
const theme = useTheme();
const app = useAppStore();

const drawer = ref(false);

const toggleTheme = () => {
  theme.global.name.value = theme.global.current.value.dark ? "light" : "dark";
};

onMounted(async () => {
  theme.global.name.value = matchMedia("(prefers-color-scheme:dark)").matches
    ? "dark"
    : "light";

  const lang = navigator.language;
  if (lang == "zh") {
    locale.value = "zhHans";
  } else if (lang == "en") {
    locale.value = "en";
  }
});
</script>
