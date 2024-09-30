import * as ADLNotations from "adnot-beport-large";
import * as ADNotations from "adnot-beport-small";

export const Notation = (function() {
  const N = ADNotations;
  const notation = type => {
    const n = new type();
    n.setAsCurrent = () => {
      player.options.notation = n.name;
      ui.notationName = n.name;
    };
    return n;
  };
  const painful = n => {
    n.isPainful = true;
    return n;
  };
  return {
    scientific: notation(N.ScientificNotation),
    engineering: notation(N.EngineeringNotation),
    letters: notation(N.LettersNotation),
    standard: painful(notation(N.StandardNotation)),
    emoji: painful(notation(N.EmojiNotation)),
    mixedScientific: notation(N.MixedScientificNotation),
    mixedEngineering: notation(N.MixedEngineeringNotation),
    logarithm: notation(N.LogarithmNotation),
    brackets: painful(notation(N.BracketsNotation)),
    infinity: notation(N.InfinityNotation),
    roman: painful(notation(N.RomanNotation)),
    dots: painful(notation(N.DotsNotation)),
    zalgo: painful(notation(N.ZalgoNotation)),
    hex: painful(notation(N.HexNotation)),
    imperial: painful(notation(N.ImperialNotation)),
    clock: painful(notation(N.ClockNotation)),
    prime: painful(notation(N.PrimeNotation)),
    bar: painful(notation(N.BarNotation)),
    shi: painful(notation(N.ShiNotation)),
    blind: painful(notation(N.BlindNotation)),
    blobs: painful(notation(N.BlobsNotation)),
    all: painful(notation(N.AllNotation))
  };
}());

export const LNotation = (function() {
  const N = ADLNotations;
  const notation = type => {
    const n = new type();
    n.setAsCurrent = () => {
      player.options.lnotation = n.name;
      ui.lnotationName = n.name;
    };
    return n;
  };
  return {
    extendedScientific: notation(N.ExtendedScientificNotation),
    stackedScientific: notation(N.StackedScientificNotation),
    semiStackedScientific: notation(N.SemiStackedScientificNotation),
    entendedLogarithm: notation(N.ExtendedLogarithmNotation),
    tetrational: notation(N.TetrationalNotation),
    trueTetrational: notation(N.TrueTetrationalNotation),
  };
}());

Notation.emoji.setAsCurrent = (silent = false) => {
  player.options.notation = Notation.emoji.name;
  ui.notationName = Notation.emoji.name;
  if (!silent) GameUI.notify.success("😂😂😂");
};

// Post e9e15
export const LNotations = {
  // Defined as a list here for exact order in options tab.
  all: [
    LNotation.extendedScientific,
    LNotation.stackedScientific,
    LNotation.semiStackedScientific,
    LNotation.entendedLogarithm,
    LNotation.tetrational,
    LNotation.trueTetrational
  ],
  find: name => {
    const notation = LNotations.all.find(n => n.name === name);
    return notation === undefined ? LNotation.extendedScientific : notation;
  },
  get current() {
    return GameUI.initialized ? ui.lnotation : LNotation.extendedScientific;
  }
};

// Pre e9e15
export const Notations = {
  // Defined as a list here for exact order in options tab.
  all: [
    Notation.scientific,
    Notation.engineering,
    Notation.letters,
    Notation.standard,
    Notation.emoji,
    Notation.mixedScientific,
    Notation.mixedEngineering,
    Notation.logarithm,
    Notation.brackets,
    Notation.infinity,
    Notation.roman,
    Notation.dots,
    Notation.zalgo,
    Notation.hex,
    Notation.imperial,
    Notation.clock,
    Notation.prime,
    Notation.bar,
    Notation.shi,
    Notation.blind,
    Notation.blobs,
    Notation.all,
  ],
  find: name => {
    const notation = Notations.all.find(n => n.name === name);
    return notation === undefined ? Notation.mixedScientific : notation;
  },
  get current() {
    return GameUI.initialized ? ui.notation : Notation.mixedScientific;
  }
};

ADNotations.Settings.isInfinite = decimal => ui.formatPreBreak && decimal.gte(DC.NUMMAX);

EventHub.logic.on(GAME_EVENT.GAME_TICK_AFTER, () => {
  ui.formatPreBreak = !PlayerProgress.hasBroken() || (NormalChallenge.isRunning && !Enslaved.isRunning);
});
