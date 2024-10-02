import * as i18nText from "./i18n/exports";

window.i18n = function(type, id, mods = []) {
  let text = "";
  // eslint-disable-next-line import/namespace
  text = Lang.current.allText[type][id];
  // If it's not defined for that language, default to English
  if (text === undefined || text === "") {
    text = Lang.EN.allText[type][id];
  }
  // If it's not defined for English, default to "Placeholder"
  if (text === undefined || text === "") {
    text = "Placeholder";
  }
  for (let i = 1; i <= mods.length; i ++) {
    text = text.replace(`$${i}aX`, typeof mods[i - 1] === "function" ? mods[i - 1]() : mods[i - 1]);
  }
  return text;
};

class LanguageState {
  constructor(allText) {
    this.allText = allText;
  }

  get name() {
    return player.options.englishLangNames ? this.nameInEN : this.nameInLang;
  }

  get nameInLang() {
    return this.allText.options.name;
  }

  get nameInEN() {
    return this.allText.options.nameInEN;
  }

  get shortName() {
    return this.allText.shortName;
  }

  setAsCurrent(silent) {
    player.options.language = this.shortName;
    if (!silent) GameUI.notify.success(`Set language to ${this.name}`);
  }
}

export const Lang = mapGameDataToObject(
  // Weird code to add the short name of the language (ie. EN) to all text
  Object.fromEntries(Object.entries(i18nText).map(i => [i[0], { ...i[1], shortName: i[0] }])),
  allText => new LanguageState(allText)
);

Object.defineProperty(Lang, "current", {
  get() { return Lang[player.options.language]; }
});