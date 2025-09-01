import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import resourcesToBackend from "i18next-resources-to-backend";
import { getOptions } from "./settings";

let started = false;

export async function ensureI18n(lng) {
  if (started) return i18next;
  started = true;
  const lang = lng || (typeof document !== "undefined" ? document.documentElement.lang : "en") || "en";
  await i18next
    .use(initReactI18next)
    .use(resourcesToBackend((language, namespace) => import(`./locales/${language}/${namespace}.json`)))
    .init(getOptions(lang));
  return i18next;
}
