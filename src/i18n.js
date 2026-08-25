/* eslint-disable no-negated-condition */
import * as i18nText from "./i18n/exports";

// eslint-disable-next-line max-params
window.i18n = function(type, id, mods = [], split = false) {
  let text = "";

  if (type !== "plurals") {
    // eslint-disable-next-line import/namespace
    // If the player is holding the "show formula" keybind, use the formula i18n
    if (Lang.showFormula) {
      text = Lang.current.allText[type][id];
    }

    // This moreorless explictly exists for testing, since I don't want to hook blind theme to this, as
    // some people may decide that they would rather not deal with i18n, which is fair.
    if (typeof player !== "undefined" && (player.options.language === "blind")) {
      return "";
    }

    // Else go to language
    if (text === undefined || text === "") {
      text = Lang.current.allText[type][id];
    }

    // If it's not defined for that language, default to English
    if (text === undefined || text === "") {
      text = Lang.GBR_EN.allText[type][id];
    }
  // If someone calls a plural directly through i18n, its easiest to make it in the "plural" format then handle it seperately.
  // This does result in having to do this text manipulation, but its fine.
  } else {
    text = "$";
    let store = Lang.current.allText.plurals[id];
    // If we are using mods, put them in
    if (mods.length) text += "1aX";
    if (store !== undefined) {
      text += `$${store.key}$$`;
    } else {
      store = Lang.GBR_EN.allText.plurals[id];
      if (store !== undefined) text = `$$${store.key}$$`;
    }
    // Since we arent using split here, we can reuse it as the "use as lowercase" condition
    if (split) text += "!$";
    if (store === undefined) text = "";
  }

  // If it's not defined for English, default to "Placeholder"
  if (text === undefined || text === "") {
    text = "Placeholder";
  }

  // We do this first, since $1aX$KEY$$ needs to be handled before it becomes VALUE$KEY$$ and breaks
  // Note if a key:name is not defined, it just wont get substituted here, but that only happens if bad translating anyways
  // (You would have to call a pluralisation and then not define it for it to occur, but plurals can just not be used)
  const plurals = Lang.current.allText.plurals;
  for (const value in plurals) {
    const key = Lang.current.allText.plurals[value];
    // Requiring unicode will break this regex key.
    // eslint-disable-next-line require-unicode-regexp
    const regexp = new RegExp(`\\$([0-9]{1,2}aX)?\\$${key.key}\\$\\$(\\!\\$)?`, "g");
    text = text.replaceAll(regexp, match => pluralHandling(match, key.rules, mods));
  }

  for (let i = 1; i <= mods.length; i++) {
    text = text.replaceAll(`$${i}aX`, handlePossibleFunction(mods[i - 1]));
  }

  if (split) text = text.split(" $ ");
  return text;
};

class LanguageState {
  constructor(allText) {
    this.allText = allText;
  }

  get name() {
    if (player.options.language === "blind") return "";
    return player.options.englishLangNames ? this.nameInEN : this.nameInLang;
  }

  get nameInLang() {
    if (player.options.language === "blind") return "";
    return this.allText.options.name;
  }

  get nameInEN() {
    if (player.options.language === "blind") return "";
    return this.allText.options.nameInEN;
  }

  get shortName() {
    if (player.options.language === "blind") return "";
    return this.allText.shortName;
  }

  setAsCurrent(silent) {
    player.options.language = this.shortName;
    // TODO: This should be i18n, how did we miss this
    if (!silent && player.options.notifications.options) GameUI.notify.success(`Set language to ${this.name}`);
  }
}

// Local version of "Map Game Date to Object" function in game database
function mgdtoLocal(gameData, mapFun) {
  const array = Object.entries(gameData);
  const out = {};
  for (let idx = 0; idx < array.length; idx++) {
    out[array[idx][0]] = mapFun(array[idx][1]);
  }

  return {
    all: Object.values(out),
    ...out
  };
};

export const Lang = mgdtoLocal(
  // Weird code to add the short name of the language (ie. EN) to all text
  Object.fromEntries(Object.entries(i18nText).map(i => [i[0], { ...i[1], shortName: i[0] }])),
  allText => new LanguageState(allText)
);

Object.defineProperty(Lang, "current", {
  get() { return Lang[typeof player !== "undefined" ? player.options.language : "GBR_EN"]; }
});

Object.defineProperty(Lang, "showFormula", {
  get() { return typeof player !== "undefined" ? player.options.showFomula : false; },
  set(value) { player.options.showFomula = value; }
});

// eslint-disable-next-line max-params
function pluralHandling(textInput, rules, mods) {
  // We dont wan't to modify inputs, so we'll redefine here.
  let text = textInput;
  const lastStr = rules.last();
  // First off, we need to check whether we have a $0aX. If we do, then we need to replace it
  // and we need to store it the function and values for later checks.
  if (!textInput.match("[0-9]{1,2}aX")) {
    // The last value in "rules" is just a string, that we treat as other
    // If there is no $0aX at the start, we just do this
    const final = lastStr.replace("$$$", "");
    return textInput.match("\$\$\!\$") ? final.toLowerCase() : final;
  }
  // [Function, data]
  let cache = [undefined, undefined];
  function pseudoReplace(textToReplace, modHandle) {
    // We will catch and log whenever we get here and call a non-function, cause that's really bad
    try {
      modHandle[0](modHandle[1]);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log("Expected an array of [function, number/decimal] for modifier input, but recieved otherwise.");
      // eslint-disable-next-line no-console
      console.log(`For info: ${textToReplace} and ${modHandle}`);
      return `${lastStr.replace("$$$", handlePossibleFunction(modHandle[i - 1]))}`;
      // This should be as robust as possible for a given system
    }
    cache = [modHandle[0], modHandle[1]];
    // If we are this far, then we know everything should work (given no stupid TOCTOU race bs)
    return textToReplace;
  }

  // eslint-disable-next-line consistent-return
  function ruleCycle(number, maxValue) {
    if (Decimal.gt(number, maxValue)) return lastStr;
    for (const value of rules) {
      // We need to ensure x is decimal not number
      if (value?.condition && value.condition(new Decimal(number))) {
        return value.text;
      }

      // We need to ensure x is a number not a decimal
      // This is stupid code, am aware
      // TODO: When adding toNumber to Decimal scope, change this back to what it shouldve been
      if (value?.values && value.values.includes(new Decimal(number).toNumber())) {
        return value.text;
      }
      if (!value?.values && !value?.condition) return value;
    }
  }

  for (let i = 1; i <= mods.length; i++) {
    // eslint-disable-next-line require-unicode-regexp
    const regex = new RegExp(`\\$${i}aX`);
    const lmods = mods;
    while (text.match(regex)) {
      let maxToHandle = 1e4;
      text = text.replace(regex, n => pseudoReplace(n, lmods[i - 1]));
      // eslint-disable-next-line eqeqeq
      if (cache[0] == formatInt) {
        maxToHandle = 1e9;
      }
      let rule = ruleCycle(cache[1], maxToHandle);
      if (textInput.match("\$\$\!\$")) {
        rule = rule.toLowerCase();
      }
      // We can just return here, since we have done what we needed to, we don't actually need to keep going
      // (there is only a single 0aX type going through here)
      if (rule.text) rule = rule.text;
      return rule.replaceAll("$$$", cache[0](cache[1]));
    }
  }

  return lastStr.replace("$$$", "");
}