import { createI18n } from "vue-i18n";
import messages from "@/i18n/index";

export default createI18n({
  legacy: false,
  locale: "zhHans",
  fallbackLocale: "en",
  messages,
});
