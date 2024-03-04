/**
 * main.ts
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Plugins
import { registerPlugins } from "@/plugins";
import pinia from "@/store";
import vuetify from "@/plugins/vuetify";
import i18n from "@/plugins/i18n";
import router from "@/router";

// Components
import App from "./App.vue";

// Composables
import { createApp } from "vue";
import { useLocaleStore } from "@/store/locale";
import { useThemeStore } from "@/store/theme";
import { useUserStore } from "./store/user";
import { useAppStore } from "./store/app";

const locale = useLocaleStore(pinia);
const theme = useThemeStore(pinia);
const user = useUserStore(pinia);

locale.$subscribe(
  (_, state) => {
    if (window) {
      localStorage.setItem("locale", state.locale);
    }
    i18n.global.availableLocales.forEach((locale) => {
      if (locale.startsWith(state.locale)) {
        i18n.global.locale.value = locale;
      }
    });
  },
  { immediate: true },
);
theme.$subscribe(
  (_, state) => {
    if (window) {
      localStorage.setItem("theme", state.name);
    }
    if (state.name == "light") {
      vuetify.theme.global.name.value = "light";
    } else if (state.name == "dark") {
      vuetify.theme.global.name.value = "dark";
    }
  },
  { immediate: true },
);

user.check();

const app = createApp(App);

registerPlugins(app);

router.beforeEach((to) => {
  const user = useUserStore();
  const { snackbar } = useAppStore();
  
  if (to.meta.requiresAuth && !user.id) {
    snackbar(i18n.global.t("notLoggedIn"), { color: "error" });
    return false;
  }
});

router.onError((err, to) => {
  if (err?.message?.includes?.("Failed to fetch dynamically imported module")) {
    if (!localStorage.getItem("vuetify:dynamic-reload")) {
      console.log("Reloading page to fix dynamic import error");
      localStorage.setItem("vuetify:dynamic-reload", "true");
      location.assign(to.fullPath);
    } else {
      console.error("Dynamic import error, reloading page did not fix it", err);
    }
  } else {
    console.error(err);
  }
});

router.isReady().then(() => {
  localStorage.removeItem("vuetify:dynamic-reload");
  app.mount("#app");
});
