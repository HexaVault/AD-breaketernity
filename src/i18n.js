/* eslint-disable import/namespace */
import * as i18nText from "./i18n/exports";

let lang = "EN";
export function i18nLanguage(language) {
  lang = language;
}

export function i18n(type, id) {
  switch (type) {
    case "ach":
      return i18nText[`${lang}ach_i18n`][id];
    default:
      return type;
  }
}