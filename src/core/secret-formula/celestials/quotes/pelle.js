/* eslint-disable no-inline-comments */
/* eslint-disable capitalized-comments */
/* eslint-disable no-unused-vars */
// These entries describe the special flash-between-celestial effect on some quotes, with the numbers being
// durations of each celestial in seconds
const flashCelestial = [
  ["teresa", 0.8],
  ["effarig", 0.8],
  ["enslaved", 0.8],
  ["v", 0.8],
  ["ra", 0.8],
  ["laitela", 0.8],
  ["pelle", 0.8]
];
/** @param {string} cel */
const primaryBackground = cel => [["pelle", 1.5], [cel, 1.5]];

/* eslint-disable no-multi-spaces */
const destroyer = i18n("quotes", "destroyer").split(" $ ");
const eternal = i18n("quotes", "eternal").split(" $ ");
const lesser = i18n("quotes", "lesser").split(" $ ");
const deities = i18n("quotes", "deities").split(" $ ");

const assured = i18n("quotes", "assured").split(" $ ");
const battle = i18n("quotes", "battle").split(" $ ");
const battles = i18n("quotes", "battles").split(" $ ");
const cluster = i18n("quotes", "cluster").split(" $ ");
const confusing = i18n("quotes", "confusing").split(" $ ");
const dance = i18n("quotes", "dance").split(" $ ");
const filament = i18n("quotes", "filament").split(" $ ");
const forever = i18n("quotes", "forever").split(" $ ");
const inevitable = i18n("quotes", "inevitable").split(" $ ");
const mandate = i18n("quotes", "mandate").split(" $ ");
const misconstrue = i18n("quotes", "misconstrue").split(" $ ");
const reverse = i18n("quotes", "reverse").split(" $ ");
const shame = i18n("quotes", "shame").split(" $ ");
const single = i18n("quotes", "single").split(" $ ");
const unseen = i18n("quotes", "unseen").split(" $ ");
const unbroken = i18n("quotes", "unbroken").split(" $ ");

const sycophant = i18n("quotes", "sycophant").split(" $ ");
const tired = i18n("quotes", "tired").split(" $ ");
const usurper = i18n("quotes", "usurper").split(" $ ");
const pride = i18n("quotes", "pride").split(" $ ");
const forgotten = i18n("quotes", "forgotten").split(" $ ");
const paramount = i18n("quotes", "paramount").split(" $ ");
/* eslint-enable no-multi-spaces */

function i18nquote(quoteids, replacements = Array.repeat("", 400), backgrounds = Array.repeat("", 400)) {
  const lines = [];
  for (let value = 0; value < quoteids.length; value++) {
    /* eslint-disable max-statements-per-line */
    if (Boolean(replacements[value]) || Boolean(backgrounds[value]) === false) { lines.push(i18n("quotes", quoteids[value])); }
    if (!Boolean(replacements[value]) && Boolean(backgrounds[value]) === true) { lines.push({ text: i18n("quotes", quoteids[value]), background: backgrounds[value] }); }
    if (Boolean(replacements[value]) && !Boolean(backgrounds[value]) === true) { lines.push({ text: i18n("quotes", quoteids[value]), 1: backgrounds[value] }); }
    if (Boolean(replacements[value]) && Boolean(backgrounds[value]) === true) {
      lines.push(() => ({ text: i18n("quotes", quoteids[value]), 1: replacements[value], background: backgrounds[value] }));
    }
    /* eslint-enable max-statements-per-line */
  }
  return lines;
}
export const pelleQuotes = {
  initial: {
    id: 0,
    lines: [() => "e"] /* i18nquote(
      ["pelle0q0", "pelle0q1", "pelle0q2", "pelle0q3", "pelle0q4", "pelle0q5", "pelle0q6", "pelle0q7", "pelle0q8", "pelle0q9", "pelle0q10",
        "pelle0q11", "pelle0q12", "pelle0q13", "pelle0q14", "pelle0q15"
      ], ["", "", "", forever, "", "", dance, "", destroyer, mandate, eternal, "", deities, unseen, destroyer, battles]
    ) */
  },
  arm: {
    id: 1,
    lines: [() => "e"] /* i18nquote(
      ["pelle1q0", "pelle1q1", "pelle1q2", "pelle1q3", "pelle1q4", "pelle1q5", "pelle1q6", "pelle1q7", "pelle1q8"],
      ["", "", "", "", unseen, mandate, confusing, misconstrue, ""]
    ) */
  },
  strike1: {
    id: 2,
    lines: [() => "e"] /* i18nquote(
      ["pelle2q0", "pelle2q1", "pelle2q2", "pelle2q3", "pelle2q4", "pelle2q5", "pelle2q6", "pelle2q7",
        "pelle2q8", "pelle2q9", "pelle2q10", "pelle2q11"
      ], [mandate, destroyer, "", battles, "", dance, lesser, eternal, reverse, unseen, "", unseen]
    ) */
  },
  strike2: {
    id: 3,
    lines: [() => "e"] /* i18nquote(
      ["pelle3q0", "pelle3q1", "pelle3q2", "pelle3q3", "pelle3q4", "pelle3q5", "pelle3q6", "pelle3q7", "pelle3q8", "pelle3q9"],
      [destroyer, "", "", "", "", "", "", "", "", single]
    ) */
  },
  strike3: {
    id: 4,
    lines: [() => "e"] /* i18nquote(
      ["pelle4q0", "pelle4q1", "pelle4q2", "pelle4q3", "pelle4q4", "pelle4q5", "pelle4q6", "pelle4q7",
        "pelle4q8", "pelle4q9", "pelle4q10"],
      ["", "", cluster, "", "", "", "", dance, "", eternal, ""]
    ) */
  },
  strike4: {
    id: 5,
    lines: [() => "e"] /* i18nquote([
      "pelle5q0", "pelle5q0", "pelle5q0", "pelle5q0", "pelle5q0", "pelle5q0", "pelle5q0", "pelle5q0",
      "pelle5q0", "pelle5q0", "pelle5q0", "pelle5q11", "pelle5q11", "pelle5q11"
    ], [
      mandate, assured, "", i18n("eter", "exceptionA").split(" $ "), destroyer, unseen, assured, "", battle,
      i18n("eter", "exceptionB").split(" $ "), "", "", dance, forever
    ]) */
  },
  strike5: {
    id: 6,
    lines: [() => "e"] /* i18nquote(
      ["pelle6q0", "pelle6q1", "pelle6q2", "pelle6q3", "pelle6q4", "pelle6q5", "pelle6q6", "pelle6q7",
        "pelle6q8", "pelle6q9", "pelle6q10", "pelle6q11", "pelle6q12", "pelle6q13", "pelle6q14", "pelle6q15",
        "pelle6q16", "pelle6q17", "pelle6q18", "pelle6q19", "pelle6q20", "pelle6q21", "pelle6q22", "pelle6q23",
        "pelle6q24", "pelle6q25", "pelle6q26", "pelle6q27", "pelle6q28", "pelle6q29", "pelle6q30", "pelle6q31",
        "pelle6q32", "pelle6q33", "pelle6q34", "pelle6q35", "pelle6q36", "pelle6q37", "pelle6q38", "pelle6q39",
        "pelle6q40", "pelle6q41", "pelle6q42", "pelle6q43", "pelle6q44", "pelle6q45", "pelle6q46", "pelle6q47",
        "pelle6q48", "pelle6q49", "pelle6q50", "pelle6q51", "pelle6q52", "pelle6q53", "pelle6q54", "pelle6q55",
        "pelle6q56", "pelle6q57", "pelle6q58", "pelle6q59", "pelle6q60"
      ],
      [deities, forever, mandate, "", lesser, sycophant, "", lesser, "", sycophant, "", "", battle, lesser, tired,
        "", "", "", tired, "", usurper, dance, usurper, "", usurper, deities, unseen, "", "", usurper, "", lesser,
        lesser, "", pride, "", "", destroyer, pride, "", forgotten, unseen, "", "", "", forgotten, usurper, shame,
        deities, unseen, "", "", lesser, paramount, "", "", paramount, "", "", unseen, destroyer
      ],
      ["", "", "", "", primaryBackground("teresa"), primaryBackground("teresa"), primaryBackground("teresa"),
        primaryBackground("teresa"), primaryBackground("teresa"), primaryBackground("teresa"), primaryBackground("teresa"),
        primaryBackground("teresa"), primaryBackground("teresa"), primaryBackground("effarig"), primaryBackground("effarig"),
        primaryBackground("effarig"), primaryBackground("effarig"), primaryBackground("effarig"), primaryBackground("effarig"),
        primaryBackground("effarig"), primaryBackground("effarig"), primaryBackground("enslaved"), primaryBackground("enslaved"),
        primaryBackground("enslaved"), primaryBackground("enslaved"), primaryBackground("enslaved"), primaryBackground("enslaved"),
        primaryBackground("enslaved"), primaryBackground("enslaved"), primaryBackground("enslaved"), primaryBackground("enslaved"),
        primaryBackground("enslaved"), primaryBackground("enslaved"), primaryBackground("v"), primaryBackground("v"),
        primaryBackground("v"), primaryBackground("v"), primaryBackground("v"), primaryBackground("v"), primaryBackground("v"),
        primaryBackground("v"), primaryBackground("ra"), primaryBackground("ra"), primaryBackground("ra"), primaryBackground("ra"),
        primaryBackground("ra"), primaryBackground("ra"), primaryBackground("ra"), primaryBackground("ra"), primaryBackground("ra"),
        primaryBackground("ra"), primaryBackground("ra"), primaryBackground("ra"), primaryBackground("ra"), primaryBackground("laitela"),
        primaryBackground("laitela"), primaryBackground("laitela"), primaryBackground("laitela"), primaryBackground("laitela"),
        primaryBackground("laitela"), "", "", ""
      ]
    ) */
  },
  galaxyGeneratorUnlock: {
    id: 7,
    lines: [() => "e"] /* i18nquote(["pelle7q0", "pelle7q1", "pelle7q2", "pelle7q3", "pelle7q4", "pelle7q5"], ["", filament, cluster, "", "", mandate]) */
  },
  galaxyGeneratorRifts: {
    id: 8,
    lines: [() => "e"] /* i18nquote(["pelle8q0", "pelle8q1", "pelle8q2", "pelle8q3", "pelle8q4", "pelle8q5"], [destroyer, filament, inevitable, "", inevitable, unbroken]) */
  },
  galaxyGeneratorPhase1: {
    id: 9,
    lines: [() => "e"] /* i18nquote(["pelle9q0", "pelle9q1"], ["", inevitable]) */
  },
  galaxyGeneratorPhase4: {
    id: 10,
    lines: [() => "e"] /* i18nquote(["pelle10q0"])*/
  },
  end: {
    id: 11,
    lines: [() => "e"] /* i18nquote([
      "pelle11q0", "pelle11q1", "pelle11q2", "pelle11q3", "pelle11q4", "pelle11q5", "pelle11q6", "pelle11q7",
      "pelle11q8", "pelle11q9", "pelle11q10", "pelle11q11"
    ], ["", destroyer, "", mandate, "", forever, battle, "", mandate, "", "", ""],
    ["", "", "", "", "", flashCelestial, flashCelestial, flashCelestial, flashCelestial, flashCelestial, flashCelestial, flashCelestial]) */
  },
};
