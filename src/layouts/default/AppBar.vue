<template>
  <v-app-bar elevate-on-scroll>
    <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
    <v-app-bar-title>{{ t("mts") }}</v-app-bar-title>

    <v-spacer />

    <user-button></user-button>
    <lang-menu></lang-menu>
    <theme-button></theme-button>
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
import { ref } from "vue";
import { useI18n } from "vue-i18n";

import { useAppStore } from "@/store/app";

const { t } = useI18n({
  messages: {
    en: {
      mts: "Moe Translation System",
      homePage: "Home",
    },
    zhHans: {
      mts: "萌译站",
      homePage: "主页",
    },
  },
});

const drawer = ref(false);
</script>
