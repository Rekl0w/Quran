import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import english from "./locales/en/translation";
import { SUPPORTED_LANGUAGE_CODES } from "./lib/constants";

const localeLoaders = import.meta.glob([
  "./locales/*/translation.js",
  "!./locales/en/translation.js",
]);
const languageRequests = new Map();

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: english },
  },
  lng: "en",
  fallbackLng: "en",
  supportedLngs: SUPPORTED_LANGUAGE_CODES,
  returnNull: false,
  interpolation: {
    escapeValue: false,
  },
});

const loadLanguage = async (language) => {
  if (i18n.hasResourceBundle(language, "translation")) return;
  if (languageRequests.has(language)) return languageRequests.get(language);

  const loader = localeLoaders[`./locales/${language}/translation.js`];
  if (!loader) throw new Error(`Missing locale module: ${language}`);

  const request = loader()
    .then((localeModule) => {
      i18n.addResourceBundle(
        language,
        "translation",
        localeModule.default,
        true,
        true
      );
    })
    .finally(() => {
      languageRequests.delete(language);
    });

  languageRequests.set(language, request);
  return request;
};

export const activateLanguage = async (language) => {
  await loadLanguage(language);
  await i18n.changeLanguage(language);
};

export default i18n;
