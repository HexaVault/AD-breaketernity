/* eslint-disable no-negated-condition */
import * as i18nText from "./i18n/exports";

// eslint-disable-next-line max-params
window.i18n = function(type, id, mods = [], split = false) {
  let text = "";
  // eslint-disable-next-line import/namespace
  // If the player is holding the "show formula" keybind, use the formula i18n
  if (Lang.showFormula) {
    text = Lang.current.allText[type][id];
  }

  // This moreorless explictly exists for testing, since I don't want to hook blind theme to this, as
  // some people may decide that they would rather not deal with i18n, which is fair.
  if (player.options.language === "blind") {
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
    text = text.replaceAll(`/\$([0-9]{1,2}aX)?\$${key.key}\$\$(\!\$)?/g`, match => pluralHandling(match, key.rules, mods));
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
  // First off, we need to check whether we have a $0aX. If we do, then we need to replace it
  // and we need to store it the function and values for later checks.
  if (!textInput.match("/[0-9]{1,2}aX/g")) {
    // The last value in "rules" is just a string, that we treat as other
    // If there is no $0aX at the start, we just do this
    const final = rules[-1].replace("$$$", "");
    return textInput.match("/\$\$\!\$/g") ? final.toLowerCase() : final;
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
      return `${rules[-1].replace("$$$", handlePossibleFunction(modHandle[i - 1]))}`;
      // This should be as robust as possible for a given system
    }
    cache = [modHandle[0], modHandle[1]];
    // If we are this far, then we know everything should work (given no stupid TOCTOU race bs)
    return textToReplace;
  }

  // eslint-disable-next-line consistent-return
  function ruleCycle(number, maxValue) {
    if (new Decimal(number).gt(maxValue)) return rules[-1];
    for (value of rules) {
      // We need to ensure x is decimal not number
      if (value?.condition && value.condition(new Decimal(number))) {
        return value.text;
      }
      // We need to ensure x is a number not a decimal
      if (value?.values && value.includes(Decimal.toNumber(number))) {
        return value.text;
      }
      return value;
    }
    return value;
  }

  for (let i = 1; i <= mods.length; i++) {
    regex = `/\$${i}aX/g`;
    while (text.match(regex)) {
      let maxToHandle = 1e4;
      text = text.replace(regex, n => pseudoReplace(n, mods[i - 1]));
      // eslint-disable-next-line eqeqeq
      if (cache[0] == formatInt) {
        maxToHandle = 1e9;
      }
      rule = ruleCycle(cache[1], maxToHandle);
      if (textInput.match("/\$\$\!\$/g")) {
        rule = rule.toLowerCase();
      }
      // We can just return here, since we have done what we needed to, we don't actually need to keep going
      // (there is only a single 0aX type going through here)
      return rule.replaceAll("$$$", cache[0](cache[1]));
    }
  }

  return rules[-1].replace("$$$", "");
}