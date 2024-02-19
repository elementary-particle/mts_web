import { createI18n } from "vue-i18n";
import messages from "@/i18n/index";
import { en, zhHans } from "vuetify/locale";

export default createI18n({
  legacy: false,
  locale: "zhHans",
  fallbackLocale: "en",
  messages: {
    en: {
      ...messages.en,
      $vuetify: {
        ...en,
      },
    },
    zhHans: {
      ...messages.zhHans,
      $vuetify: {
        ...zhHans,
      },
    },
  },
});
