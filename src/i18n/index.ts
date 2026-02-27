import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./locales/en.json";
import hr from "./locales/hr.json";

const savedLanguage = localStorage.getItem("lang") || "en";

i18n.use(initReactI18next).init({
    resources: {
        en: { translation: en },
        hr: { translation: hr },
    },
    lng: savedLanguage,
    fallbackLng: "en",
    interpolation: {
        escapeValue: false, // React already escapes
    },
});

export default i18n;
