<template>
  <v-menu location="top">
    <template v-slot:activator="{ props }">
      <v-btn icon v-bind="props">
        <v-icon :icon="mdiTranslate" />
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
          @click="lang.locale = locale"
          :active="lang.locale == locale"
          density="compact"
        ></v-list-item>
      </template>
    </v-list>
  </v-menu>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { useLocaleStore } from "@/store/locale";
import { mdiTranslate } from "@mdi/js";

const lang = useLocaleStore();
const { t, availableLocales } = useI18n({
  messages: {
    en: {
      lang: "English",
    },
    zhHans: {
      lang: "简体中文",
    },
  },
});
</script>
