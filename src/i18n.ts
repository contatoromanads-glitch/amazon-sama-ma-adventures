import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import pt from './locales/pt.json';
import en from './locales/en.json';
import es from './locales/es.json';
import zh from './locales/zh.json';

const resources = {
  'pt-BR': { translation: pt },
  'en-US': { translation: en },
  'es': { translation: es },
  'zh': { translation: zh },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'pt-BR', // default language
    fallbackLng: 'pt-BR',
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

export default i18n;
