/* eslint-disable max-len */
/* eslint-disable camelcase */

// All challenge info (includes celestials), i18n support
export const chall = {
  lockednc: "Infinity $1aX times to unlock.",
  nc1noeter: "Reach Infinity for the first time",
  nc1: "Reach Infinity for the first time outside of a challenge.",
  nc1rew: "Reward: Upgradeable 1st Antimatter Dimension Autobuyer",
  nc2: "Buying Antimatter Dimensions or Tickspeed upgrades halts production of all Antimatter Dimensions. Production gradually returns over $1aX minutes.",
  nc2rew: "Reward: Upgradeable 2nd Antimatter Dimension Autobuyer",
  nc3: "The 1st Antimatter Dimension is heavily weakened, but gains an uncapped exponentially increasing multiplier. This multiplier is reset after Dimension Boosts or Antimatter Galaxies.",
  nc3rew: "Reward: Upgradeable 3rd Antimatter Dimension Autobuyer",
  nc4: "Buying an Antimatter Dimension automatically erases all lower tier Antimatter Dimensions, like a sacrifice without the boost.",
  nc4rew: "Reward: Upgradeable 4th Antimatter Dimension Autobuyer",
  nc5: "The Tickspeed purchase multiplier starts at $1aX instead of $2aX.",
  nc5rew: "Reward: Upgradeable 5th Antimatter Dimension Autobuyer",
  nc6: "Upgrading each Antiamtter Dimension costs the Antimatter Dimension 2 tiers below it instead of antimatter. Antimatter Dimension prices are modified.",
  nc6rew: "Reward: Upgradeable 6th Antimatter Dimension Autobuyer",
  nc7: "The multiplier from buying $1aX Antimatter Dimensions is reduced to $2aX. This increased by $3aX per Dimension Boost, to a maximum of $4aX, and is unaffected by any upgrades.",
  nc7rew: "Reward: Upgradeable 7th Antimatter Dimension Autobuyer",
  nc8: "Dimension Boosts provide no multiplier and Antimatter Galaxies cannot be bought. Dimensional Sacrifice resets antimatter and all Antimatter Dimensions, but gives a significantly stronger multiplier.",
  nc8rew: "Reward: Upgradeable 8th Antimatter Dimension Autobuyer",
  nc9: "Whenever you buy Tickspeed upgrades or $1aX of an Antimatter Dimension, everything else of equal cost will increase to its next cost step.",
  nc9rew: "Reward: Upgradeable Tickspeed Autobuyer",
  nc10: "There are only $1aX Antimatter Dimensions. Dimension Boost and Antimatter Galaxy costs are modified.",
  nc10rew: "Reward: Dimension Boosts Autobuyer",
  nc11: "There is normal matter which rises once you have atleast $1aX 2nd Antimatter Dimension. If it exceeds your antimatter, it will Dimension Boost without giving the bonus.",
  nc11rew: "Reward: Antimatter Galaxies Autobuyer",
  nc12: "Each Antimatter Dimension produces the one $1aX tiers below it instead of $2aX. Both 1st and 2nd Dimensions produce antimatter. The 2nd, 4th and 6th Dimensions are made stronger to compensate.",
  nc12rew: "Reward: Big Crunch Autobuyer",
  ic1: "all Normal Challenge resrtictions are active at once, with the exception of the Tickspeed (C9) and Big Crunch (C12) Challenges.",
  ic1rew: "Reward: $1aX on all Infinity Dimensions for each Infinity Challenge Completed",
  ic2: "Dimensional Sacrifice happens once every $1aX milliseconds once you have an 8th Antimatter dimension.",
  ic2rew: "Reward: Dimensional Sacrifice Autobuyer and stronger Dimensional Sacrifice ($1aX)^$2aX ➜ AD1^$3aX",
  ic3: "Tickspeed upgrades are always $1aX. For every Tickspeed upgrade purchase, you instead get a static multiplier on all Antimatter Dimensions which increased based on Antimatter Galaxies.",
  ic3rew: "Reward: Antimatter Dimension Multiplier based on Antimatter Galaxies and Tickspeed Purchases",
  ic4: "Only the latest bought Antimatter Dimension production is normal. All other Antimatter Dimensions produce less ($1aX)",
  ic4rew: "Reward: All Antimatter Dimension multipliers become multipliers^$1aX",
  ic5: "Buying Antimatter Dimensions 1-4 causes all cheaper AD costs to increase. Buying Antimatter Dimensions 5-8 causes all more expensive AD costs to increase.",
  ic5rew: "Reward: All Galaxies are $1aX stronger and reduce the requirements for them and Dimension boost by $2aX",
  ic6: "Exponentially rising matter divides the multiplier on all of your Antimatter Dimensions once you have at least $1aX 2nd Antimatter Dimension",
  ic6rew: "Reward: Infinity Dimension Multiplier based on tickspeed",
  ic7: "You cannot buy Antimatter Galaxies. Base Dimension Boost multiplier is increased to a maximum of $1aX. (Current base multiplier: ($2aX)",
  ic7rew: "Reward: Dimension Boost multiplier is increased to a minimum of $1aX",
  ic8: "AD production rapidly and continually drops over time. Purchasing Antimatter Dimension or Tickspeed upgrades sets production back to $1aX before it starts dropping again.",
  ic8rew: "Reward: You get a multiplier to AD 2-7 based on 1st and 8th AD multipliers.",
  ecPelleInfinityRemoved: "The Pelle-Specific effect from Infinity Glyphs is also disabled.",
  ec1: "Time Dimensions are disabled",
  ec1rew: "Time Dimension multiplier based on time spent this Eternity",
  ec2: "Infinity Dimensions are disabled",
  ec2rew: "1st Infinity Dimension multiplier based on Infinity Power",
  ec3: "Antimatter Dimensions 5-8 don't produce anything. Dimensional Sacrifice is disabled.",
  ec3rew: "Increase the multiplier for buying $1aX Antimatter Dimensions",
  ec4: "All Infinity multipliers and generators are disabled. The goal must be reached within a certain number of Infinities or else you will fail the challenge.",
  ec4restriction: "without any Infinities$in $1aX Infinities or less",
  ec4rew: "Infinity Dimension multiplier based on unspent IP",
  ec4fail: "(Too many Infinities for more)",
  ec5: "Antimatter Galxy cost increase scaling starts immediately (normally at $1aX Galaxies). Dimension Boost costs scaling is massive increased",
  ec5rew: "Distant Galaxy cost scaling starts later",
  ec5rewFormat: "$1aX AG later",
  ec6enslaved: "You *. The cost of upgrading your max Replicanti Galaxies is massively reduced.",
  ec6: "You cannot gain Antimatter Galaxies normally. The cost of upgrading your max Replicanti Galaxies is massively reduced.",
  ec6rew: "Further reduce Antimatter Dimension cost multiplier growth",
  ec6rewFormat: "-$1aX ($2aX total)",
  // For Translators:
  // Attempt to keep the scramble the same, changing the letters that arent different in the scramble to match the language. Keep space around $
  ec6enslavedScramble: "cannot gain Antimatter Galaxies normally $ c㏰'퐚 gai鸭 Anti꟢at랜erﻪﶓa⁍axie㮾 䂇orma㦂l",
  ec7: "1st Time Dimensions produce 8th Infinity Dimensions and 1st Infinity Dimensions produce 7th Antimatter Dimensions. Tickspeed also directly applies to Infinity and Time Dimensions.",
  ec7rew: "1st Time Dimension produces 8th Infinity Dimensions",
  ec7rewFormat: "$1aX per second",
  ec8: "You can only upgrade Infinity Dimensions $1aX times and Replicanti ugprades $2aX times. Infinity Dimension and Replicanti upgrade autobuyers are disabled.",
  ec8rew: "Infinity Power strengthens Replicanti Galaxies",
  ec9: "You cannot buy Tickspeed upgrades. Infinity Power instead multipliers Time Dimensions with greatly reduced effect. $1aX",
  ec9rew: "Infinity Dimension multiplier based on Time Shards",
  ec10: "Time Dimensions and Infinity Dimensions are disabled. You gain an immense boost from Infinities to Antimatter Dimensions (Infinities^$1aX). $2aX",
  ec10additional: " Currently: $1aX",
  ec10rew: "Time Dimension multiplier based on Infinities",
  ec10rewFormat: "$1aX (After TS31: $2aX)",
  ec11: "All Dimension multipliers and powers are disabled, except for the multipliers from Infinity Dimensions and Dimension Boosts (to Antimatter Dimensions). $1aX",
  ec11rew: "Further reduce Tickspeed cost multiplier growth",
  ec11rewFormat: "-$1aX ($2aX total)",
  ec12: "The game runs ×$1aX slower; The goal must be reached within a certain amount of time or you will fail the challenge.",
  ec12real: "The game runs ×$1aX slower; all other game speed effects are disabled. The goal must be reached within a certain amount of time or you will fail the challenge. $2aX",
  ec12restriction: "in $1aX in-game-second or less$in $1aX in-game-seconds or less",
  ec12rew: "Infinity Dimension cost multipliers are reduced",
  ec12fail: "(Too slow for more)",
  teresa: "Glyph Time Theorem generation is disabled. You gain less Infinity Points and Eternity Points (x^$1aX).",
  effarig: `All Dimension multipliers, game speed, and tickspeed are severely lowered, like Dilation. Infinity Power reduces the reduction and game speed penalties and
  Time Shards reduce the tickspeed penalty. Glyph levels are temporarily capped to $1aX, rarity is unaffected`,
  effarigdesc: "You will exit Effarig's Reality when you complete a Layer of it for the first time.",
  enslaved: `Glyph levels are boosted to a minimum of $1aX.
  Infinity, Time, and 8th Antimatter Dimension purchases are limited to $2aX each.
  Antimatter Dimension multipliers are always Dilated (the Glyph effect still only applies in actual Dilation).
  Time Study 192 (uncapped Replicanti) is locked.
  The Black Hole is disabled.
  Tachyon Particle production and Dilated Time production are severely reduced.
  Time Theorem generation from Dilation Glyphs is disabled.
  Certain challenge goals are increased.
  Stored game time is discharged at a reduced effectiveness (exponent^$3aX)`,
  vMain: `All Dimension multipliers, Eternity Point gain, Infinity Point gain, and Dilated Time gain\
  per second are square-rooted. The Replicanti interval is squared.`,
  vAdditional: "The Exponential Glyph Alchemy effect is disabled.",
  ra: "You only have $1aX Dimension Boosts and can not gain any more. The Tickspeed purchase multiplier is fixed at $2aX.",
  laiMain: `Infinity Point and Eternity Point gain are Dilated. Game speed is reduced to $1aX and gradually comes back over $2aX minutes.
  Black Hole storing, discharging, pulsing, and inversion are all disabled. $3aX`,
  laidisabledmain: "Production from $1aX is disabled.",
  laidisabled: "all Dimensions$2nd and higher Dimensions$3rd and higher Dimensions$4th and higher Dimensions$5th and higher Dimensions$6th and higher Dimensions$7th and higher Dimensions$8th Dimensions",
  laidesc: `Antimatter generates entropy inside of this Reality.
  At $1aX entropy, the Reality becomes destabilized
  and you gain a reward based on how quickly you reached $1aX.
  Destabilizing the Reality in less than $2aX seconds makes it become significantly more difficult,
  in exchange for giving a much stronger reward.
  Doing this $3aX times will also give a $4aX to Dark Energy Gain.`
};