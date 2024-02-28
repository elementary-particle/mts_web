<template>
  <v-app-bar elevate-on-scroll>
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
        <template v-for="locale in availableLocales" :key="locale">
          <v-list-item
            :title="
              t('lang', locale, {
                locale,
              })
            "
            @click="
              $i18n.locale = locale;
              toggleLang(locale);
            "
            :active="$i18n.locale == locale"
            density="compact"
          ></v-list-item>
        </template>
      </v-list>
    </v-menu>
    <v-btn icon @click="toggleTheme()">
      <v-icon v-if="theme.global.name.value == 'light'">
        mdi-weather-sunny
      </v-icon>
      <v-icon v-if="theme.global.name.value == 'dark'">
        mdi-weather-night
      </v-icon>
    </v-btn>
  </v-app-bar>

  <v-navigation-drawer v-model="drawer" temporary>
    <v-list nav>
      <v-list-item
        :title="t('homePage')"
        prepend-icon="mdi-home"
        @click="$router.push('/')"
        :active="$route.path == '/'"
      ></v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useTheme } from "vuetify";
import { useI18n } from "vue-i18n";

import { useAppStore } from "@/store/app";

const { t, locale, availableLocales } = useI18n({
  messages: {
    en: {
      mts: "Moe Translation System",
      homePage: "Home",
      lang: "English",
    },
    zhHans: {
      mts: "萌译站",
      homePage: "主页",
      lang: "简体中文",
    },
  },
});
const theme = useTheme();
const app = useAppStore();

const drawer = ref(false);

const toggleTheme = () => {
  localStorage.theme = theme.global.current.value.dark ? "light" : "dark";
  theme.global.name.value = localStorage.theme;
};

const toggleLang = (lang: string) => {
  localStorage.lang = lang;
};

onMounted(async () => {
  localStorage.theme = localStorage.theme
    ? localStorage.theme
    : matchMedia("(prefers-color-scheme:dark)").matches
      ? "dark"
      : "light";
  theme.global.name.value = localStorage.theme;
});
</script>
