import {createI18n} from "vue-i18n";

import eng from "@/localizations/eng.json";

import ger from "@/localizations/ger.json";
import {ref} from "vue";

export const langVal = ref(false);
export const xmiConverterIsShown = ref(true);

export const i18n = createI18n({
    locale: 'en',
    fallbackLocale: 'en',
    messages: {
        en: eng,
        de: ger
    }
});

export function toggleLanguage() {
    if (i18n.global.locale === 'en') {
        langVal.value = true;
        i18n.global.locale = 'de';
    } else {
        langVal.value = false;
        i18n.global.locale = 'en';
    }
}