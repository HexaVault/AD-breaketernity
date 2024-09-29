/* eslint-disable import/namespace */
import * as i18nText from "./i18n/exports";

let lang = "EN";
export function i18nLanguage(language) {
  lang = language;
}

export function i18n(type, id, mods = []) {
  let text = "";
  text = i18nText[`${lang}${type}_i18n`][id];
  if (text === undefined || text === "") {
    text = i18nText[`EN${type}_i18n`][id];
  }
  if (text === undefined || text === "") {
    text = "Placeholder";
  }
  for (let i = 1; i <= mods.length; i ++) {
    text = text.replace(`$${i}aX`, typeof mods[i - 1] === "function" ? mods[i - 1]() : mods[i - 1]);
  }
  return text;
}