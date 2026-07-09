/* eslint-disable no-inline-comments */
/* eslint-disable line-comment-position */
/* eslint-disable max-len */
/* eslint-disable camelcase */

// All modal info, i18n support
export const modal = {
  // To make this easier, everything called by Modal.message will go first
  glyphMoveModal: "The selected Glyph changed position or was otherwise changed!",
  notifyBackupLoad: "Game loaded from backup slot #$1aX",
  infAnimationModal: `This animation will occur after every manually-triggered Infinity. If \
you would like to disable it, there is a setting to do so in the Options tab. This can be done for any \
visual animation effect in the game after seeing it for the first time.`,
  // Everything below here is in a vue file for itself, not the general Modal.message
  catchupModalTitleA: "Content Catch-up",
  catchupModalTitleB: "Content Summary",
  catchupModalBeenXTime: "It has been $1aX since you last loaded up the game.",
  catchupModalNeedARefresher: `If you need a refresher, here is a quick summary of all the content you have unlocked so far from the beginning of
the game, separated into different stages of progression. These are only very brief descriptions; you can check
the related How To Play entries by clicking the contents title or $ icons to view more detailed information.`,
  catchupModalBasedOnProgression: `Based on your current progression, it will probably be useful to try to increase your $1aX.`,
  eternityChallengeModalEternityAndStart: `You will Eternity (if possible) and start a new Eternity within the Challenge, with all the
Challenge-specific restrictions and modifiers active. To complete the Challenge$1aX, you must reach the Challenge goal of
$2aX$IP$$. You can complete Eternity Challenges up to $3aX times, with increasing goals and bonuses.`,
  // This replaces the $1aX in the string above, if the challenge has not been completed, else the $1aX is just removed
  challengeModalInfix: " and gain its reward",
  eternityChallengeModalAboutToEnter: "You are about to enter Eternity Challenge $1aX",
  eternityChallengeModalRewardForCompletion: "The reward for completing this challenge is: $1aX",
  eternityChallengeModalInsideEC: "Inside this Eternity Challenge, $1aX",
  infinityChallengeModalInfinityAndStart: `You will Big Crunch (if possible) and start a new Infinity within the Challenge, with all the
Challenge-specific restrictions and modifiers active. To complete the Challenge$1aX, you must reach the Challenge goal of
$2aX$AM$$ You do not start with any Dimension Boosts or Galaxies, regardless of upgrades.`,
  // Same as EC, uses infix above
  infinityChallengeModalAboutToEnter: "You are about to enter Infinity Challenge $1aX",
  infinityChallengeModalRewardForCompletion: "The reward for completing this challenge is: $1aX",
  infinityChallengeModalInsideIC: "Inside this Infinity Challenge, $1aX",
  normalChallengeModalMessage: `You will Big Crunch (if possible) and start a new Infinity within the Challenge, with all the
Challenge-specific restrictions and modifiers active. To complete the Challenge$1aX, you must reach Infinity again.
You do not start with any Dimension Boosts or Galaxies, regardless of upgrades.`,
  normalChallengeModalAboutToEnter: "You are about to enter Challenge $1aX",
  normalChallengeModalRewardForCompletion: "The reward for completing this challenge is: $1aX",
  normalChallengeModalInsideNC: "Inside this Challenge, $1aX",
  companionDeletion0: "Are you sure you want to get rid of your Companion Glyph?",
  companionDeletion1: "You will not receive any cake.",
  companionDeletion2: "This is permanent! You will not get another Companion Glyph!",
  companionDeletion3: `You deleted your faithful Companion Glyph more quickly than any other test subject on record. Congratulations.`,
  thankYou: "Thank you",
  glyphDeletionModalMsg1: "You are about to delete a Glyph",
  glyphDeletionModalMsg2: "Deleting a Glyph will remove the Glyph from your inventory!",
  glyphDeletionModalMsg3: "There is no benefit in deleting a Glyph before you have unlocked Glyph Sacrifice!",
  glyphPurgeRejectedModalTitle: "You are about to Sacrifice all rejected Glyphs $ You are about to Refine all rejected Glyphs",
  glyphPurgeRejectedModalMessage: `Are you sure you want to Sacrifice all rejected Glyphs? This will remove
all Glyphs that would be rejected by your current Glyph Filter settings.$1aX $ Are you sure you want to Refine all rejected Glyphs? This will remove
all Glyphs that would be rejected by your current Glyph Filter settings.$1aX `,
  glyphPurgeRejectedModalNegativeFilter: `Note that some of your Effect Filter scores are negative, which may cause you to
lose some Glyphs you normally want to keep.`,
  removesNoGlyphs: "This will sacrifice no Glyphs. $ This will refine no Glyphs. $ This will delete no Glyphs.",
  removesAllGlyphs: "This will sacrifice all your Glyphs. $ This will refine all your Glyphs. $ This will delete all your Glyphs",
  removesSomeGlyphs: "This will sacrifice $1aX$GLY$$. $ This will refine $1aX$GLY$$. $ This will delete $1aX$GLY$$",
  glyphPurgeUnprotectedModalTitle: `You are about to Sacrifice all unprotected Glyphs $ You are about to Refine all unprotected Glyphs\
   $ You are about to Delete all unprotected Glyphs`,
  glyphPurgeUnprotectedModalMsg: `Are you sure you want to sacrifice all unprotected Glyphs in your inventory? $ \
  Are you sure you want to refine all unprotected Glyphs in your inventory? $ \
  Are you sure you want to delete all unprotected Glyphs in your inventory?`,
  purgesNoGlyphs: "This will Purge no Glyphs. $ This will Harsh Purge no Glyphs",
  purgesAllGlyphs: "This will Purge all your Glyphs. $ This will Harsh Purge no Glyphs.",
  purgesSomeGlyphs: "Purge will delete $1aX$GLY$$. $ Harsh Purge will delete $1aX$GLY$$.",
  glyphPurgeModalHarshPurgeExplantion: `Harsh Purging deletes Glyphs that are strictly worse than any other Glyph in your
inventory. For example, if a Glyph has all the same effects as another Glyph, but the values
of ALL of the effects are worse, then it will be deleted.`,
  glyphPurgeModalPurgeExplanation: `Purging deletes Glyphs that are strictly worse than other Glyphs, while keeping enough to equip a full
set with those effects. This behaves like Harsh Purge, except that regular Purge will not delete any given
Glyph unless it finds enough Glyphs which are better. For most glyphs, this is five, but some will only keep one.`,
  glyphPurgeModalTitle: "You are about to Purge your Glyphs $ You are about to Harsh Purge your Glyphs",
  glyphPurgeModalPurgeNote: `This could delete Glyphs in your inventory that are good enough that you might want to use them
later. Purging will Purge Glyphs based on your Purge mode. Are you sure you want to do this?`,
  glyphRefineModalTitle: "You are about to refine a Glyph",
  glyphRefineModalMessageUnlocked: `Refining a Glyph will remove the Glyph from your inventory, and in return,
you will increase your $1aX Alchemy resource from $2aX to $3aX. This Glyph can raise your $4aX resource to at most $5aX.`,
  glyphRefineModalMessageLocked: `You cannot gain any $1aX alchemy resource because you have not
unlocked this Glyph's resource yet. You can still refine it anyway, but nothing will happen. Consider sacrificing the Glyph instead.`,
  glyphSacrificeModalTitle: "You are about to sacrifice a Glyph",
  glyphSacrificeModalMessage: `Do you really want to sacrifice this Glyph? Your total power of sacrificed $1aX
Glyphs will increase from $2aX to $3aX.`,
  cosmeticSetChoiceModalNone: "None Selected",
  cosmeticSetChoiceModalChooseCosmeticSet: "Choose a Glyph Cosmetic Set",
  cosmeticSetChoiceModalDropdown: "▼ Available Sets ▼",
  cosmeticSetChoiceModalSetContains: "The \"$1aX\" Set contains the following $2aX:",
  glyphCosmeticChooseSymbol: "$1aX$SYM$$!$",
  glyphCosmeticChooseColorScheme: "$1aX$CSC$$!$",
  glyphCustomizationModalTitle: "Custom Glyph Appearance",
  glyphCustomizationModalResetAppearance: "Reset Appearances to Default:",
  glyphCustomizationModalMessage: `\
  All Types $ \
  This Type $ \
  This will not reset any individually-modified Glyphs. $ \
  Glyph Type:`,
  glyphCustomizationModalOptionsNote: `Note: Some options may cause very poor color contrast or readability on certain themes with certain Glyph types.$
You currently have no available options for changing the default appearance of your Glyphs. To unlock some, visit
the Shop Tab or beat the game.$
Enabling this setting will allow you to change individual Glyphs to special cosmetic types you have unlocked.$
Enabling or disabling this option will currently do nothing.`,
  glyphCustomizationModalResetIndividualCosmetics: "Reset all individual Glyph cosmetics",
  glyphCustomizationSingleModalAppearanceOpt: "Appearance Options for $1aX Glyphs",
  glyphCustomizationSingleModalCannotModifyCompanion: "Companion Glyphs cannot have their symbol modified.",
  glyphCustomizationSlidingModalNote: "You have no custom options for changing Glyph $$SYM$$. $ You have no custom options for changing Glyph colors.",
  glyphDisplayOptionsModalGlyphBackgroundSetting: "Auto $ Light $ Dark",
  glyphDisplayOptionsModalList: `New Glyph identifier: $ Unequipped Glyph identifier: $ Always show Glyph effect dots: $ 
  Fancy Glyph borders: $ Always show Glyph Info: $ High-cotrast rarity colors: $ Swap border and symbol colors`,
  glyphDisplayOptionsModalTopLabel: "Glyph Display Options",
  glyphDisplayOptionsModalGlyphBGcol: "Glyph BG color: $1aX",
  glyphDisplayOptionsModalAdditionalGlyphInfo: "▼ Additional Glyph Info: ▼",
  singleGlyphAppearanceModalTitle: "Modifying Single Glyph Appearance",
  singleGlyphAppearanceModalResetAppearance: "Reset this Glyph's appearance",
  singleGlyphAppearanceModalCantChange: "This Glyph's Cosmetic Type cannot be changed!",
  singleGlyphAppearanceModalApplySpecial: "Apply Special Cosmetic Type:",
  hideSubtabsModalButtonCannotHideCurrent: "You cannot hide the tab you are on",
  hideSubtabsModalButtonCannotHideOption: "Options tabs cannot be hidden",
  hideSubtabsModalClickToHide: "Click to hide tab",
  hideSubtabsModalClickToUnhide: "Click to unhide tab",
  hideSubtabsModalCannotHide: "This tab cannot be hidden",
  hideTabModalTitle: "Modify Visible Tabs",
  hideTabModalMessage: `Click a button to toggle showing a tab on/off. $ Some tabs cannot be hidden, and you cannot hide your current tab. $ \
Unhiding a tab in which all subtabs are hidden will also unhide all subtabs, and hiding all subtabs will also hide the tab.`,
  hideTabModalAfterGalGen: "You cannot hide your tabs after unlocking the Galaxy Generator.",
  hideTabModalNamelessA: "You must... see everywhere...",
  hideTabModalNamelessB: "(You cannot hide your tabs within this Reality)",
  hideTabModalShowAllTabs: "Show all tabs",
  animationOptionsModalTitle: "Animation Options",
  animationOptionsModalAnimationList: `Big Crunch: $ Eternity: $ Dilation: $ Tachyon particles: $ Reality $ \
  Always use Blobhole: $ Background: $ Blobsnow: $ Blobflake:`, // To here, so far
  awayOptionsModalTitle: "Away Progress Options",
  awayOptionsModalNote: "Note: Selected resources will only show if they've increased.",
  backupEntryModalEmpty: "(Empty)",
  backupEntryModalSavesOnline: "Saves every $1aX online",
  backupEntryModalSavesOffline: "Saves every $1aX offline",
  backupEntryModalSavesPreload: "Pre-loading save",
  backupEntryModalLastSaved: "Last saved: $1aX ago",
  backupEntryModalUnusedSlot: "Slot not currently in use",
  backupEntryModalSlotX: "Slot #$1aX",
  backupEntryModalResources: "Reality Shards $ Imaginary Machine Cap $ Reality Machines $ $$EP$$ $ $$IP$$ $ $$AM$$",
  backupEntryModalNoResources: "No resources",
  backupModalTitle: "Automatic Backup Saves",
  backupModalInformationTextA: `The game makes automatic backups based on time you have spent online or offline. \
Timers for online backups only run when the game is open, and offline backups only save to the slot with the longest applicable timer. \
Additionally, your current save is saved into the last slot any time a backup from here is loaded.`,
  backupModalInformationTextB_Steam: `These backups are still stored in the same place as your game save and can still be lost if you do anything \
external to the game which would delete your save itself, such as deleting your AppData. You can import/export all backups at once as files, using these buttons:`,
  backupModalInformationTextB_Brower: `These backups are still stored in the same place as your game save and can still be lost if you do anything \
external to the game which would delete your save itself, such as clearing your browser cookies. You can import/export all backups at once as files, using these buttons:`,
  backupModalLoadWithoutOffline: "Load with offline progress disabled",
  backupModalExportFile: "Export as file",
  backupModalImportFile: "Import from file",
  backupModalSavesSeperateBackups: "Each of your three save slots has its own seperate set of backups",
  confirmationOptionsTitle: "Confirmation Options",
  confirmationOptionsNothingNeedsConfirmation: `You do not have anything that requires confirmation, but if you did it would appear here.`,
  hotkeyModalTitle: "Hotkey List",
  hotkeyModalXDimensions: "Buy 1 Dimension$Buy 10 Dimensions",
  hotkeyModalInfoForShift: `Shift is a modifier key that shows additional information on certain things
and adjusts the function of certain buttons.`,
  hotkeyModalInfoAboutAlt: `Alt is a modifier key that, when pressed in conjunction with any key that has a corresponding autobuyer, will toggle said autobuyer.`,
  hotkeyModalInfoAboutAltShift: `When pressing both Alt and Shift, you can toggle buying singles or buying max for the Antimatter Dimension and Tickspeed Autobuyers instead.`,
  hotkeyModalInfoAboutArrows: `Using the Arrow Keys will cycle you through the game's pages. \
The Up and Down arrows cycle you through tabs, \
and the Left and Right arrows cycle you through that tab's subtabs.`,
  // The double spaces around $ are intentional, as the string " $ " is converted, not just the $ sign, but we want gaps around the symbols
  hotkeyModalInfoAboutNumpad: `Due to technical reasons, pressing a numpad key will purchase 10 of a Dimension if possible, but pressing \
a numpad key with $ will not buy a single Dimension. It may instead, depending on your device, \
cause the page to scroll or change game tabs.  $  will still work as expected.`,
  hotkeyModalWindowZoom: "Window Zoom",
  hotkeyModalToAdjustZoom: `To adjust zoom level, hold  $  and press either  $  or $  to decrease or increase zoom.  $  will reset zoom to 100%.`,
  hotkeyModalFullscreen: "Fullscreen",
  hotkeyModalToEnterFullscreen: "To enter or exit fullscreen, press  $ .",
  hotkeyModalAboutShift: `You can hold Shift: $  while buying Time Studies to buy all up until that point $ to save Time Study Trees $ to purge Glyphs`,
  hotkeyModalModifierKeys: "Modifier Keys",
  hotkeyModalInternalHeaders: "Modifier Key $ Autobuyer Controls $ Tab Movement $ Numpad Support",
  infoDisplayModalTitle: "Info Display Options",
  infoDisplayModalSettings: `Show % gain: $ Achievement IDs: $ Achievement unlock state indicators: $ Challenge IDs: $ Time Study IDs: $ \
Glyph effect dots: $ Reality Upgrade names: $ Perk IDs: $ Alchemy resource amounts:`,
  infoDisplayModalNote: "Note: All types of additional info above will always display when holding shift.",
  NewsSettingModalToggle: "News: $1aX",
  NewsSettingModalTittle: "News Options",
  NewsSettingModalRepeatBuffer: "$1aX message repeat buffer",
  NewsSettingModalAI: "$1aX AI messages",
  NewsSettingModalSpeed: "$1aX scroll speed",
  NewsSettingModalAnimations: "Animation Effects:",
  notationModalTitle: "Exponent Notation Settings",
  notationModalText: `You can adjust what your numbers look like when very large. With small values, the exponent will \
be directly displayed with no additional formatting. Larger values will have commas inserted into the exponent \
for clarity, and the largest values will apply notation formatting to the exponent in order to shorten it. You can \
adjust the two thresholds between these regions below:`,
  notationModalMinCommas: "Minimum for commas in exponent: $1aX digits",
  notationModalMaxCommas: "Minimum for notation in exponent: $1aX digits",
  notationModalSamples: "Sample numbers for exponent formatting:",
  notationModalNote: `Note: The interface is generally optimized for Scientific notation with settings of $1aX \
and $2aX digits. Some text may look odd or overflow out of boxes if you \
differ significantly from these values. Additionally, these settings might not cause any visual changes \
when using certain notations.`,
  preferTreeModalDim: "Dimension Split Preference",
  preferTreeModalPace: "Pace Split Preference",
  glyphInfoModalOptions: "None $ Level $ Rarity $ Sacrifice Value $ Glyph Filter Score $ Current Refinement Value $ Maximum Refinement Value",
  agModalTitle: "You are about to purchase $1aX$AGAL$$",
  agModalResettableResources: "$$AM$$ $ $$AD$$ $ Tickspeed $ Dimension Boosts",
  agModalICx: "Infinity Challlenge $1aX",
  agModalRaReality: "$1aX's Reality",
  agModalWillBoostTickspeed: "you will receive a small boost to Tickspeed Upgrades.",
  agModalWillNotBoostTickspeed: "you will not receive a boost to Tickspeed Upgrades, because you are in $1aX",
  agModalWillResetNothing: "This will reset nothing, and $1aX",
  agModalWillResetX: "This will reset your $1aX. However, $2aX",
  agModalPurchaseConfirmation: "Are you sure you want to purchase $1aX$AGAL$$? $2aX",
  armageddonModalAboutToDoom: "You are about to Doom your Reality",
  armageddonModalTitle: "You are about to perform an Armageddon reset",
  armageddonModalArmageddonReset: "Armageddon will start a new Doomed Reality. You will gain $1aX$REM$$ $2aX",
  armageddonModalFirstReset: "which will produce $1aX$REALSHARD$$/s",
  armageddonModalNotFirstReset: "which will increase your Reality Shards gain from $1aX/s to $2aX/s",
  armageddonModalDoomInfo: `Dooming your Reality will reset everything except Challenge records, Celestial progress and anything under \
the General and Reality header on the Statistics tab. You will not gain any rewards from your progress \
in your current Reality. Dooming your Reality will also purge most of your unprotected Glyphs and disable certain game mechanics.`,
  armageddonModalConfirmation: "Are you sure you want to do this?",
  infinityModalTitle: "You are about to Infinity",
  infinityModalWillReset: "Upon Infinity, all Dimensions, Dimension Boosts, and Antimatter Galaxies are reset. $1aX",
  infinityModalFirstInfinityInfo: `In return, you gain an Infinity Point (IP). This allows you to buy multiple upgrades that you can
find in the Infinity tab. You will also gain one Infinity, which is the stat shown in the Statistics tab.`,
  infinityModalInfinityGain: "You will gain $1aX$INF$$ and $2aX$IP$$.",
  infinityModalStartNextInf: "You will start your next Infinity with $1aX$AM$$ $ $2aX$DB$$ $ $3aX$AGAL$$.",
  dbModalTitle: "You are about to do a Dimension Boost Reset",
  dbModalReset: "This will reset your Antimatter and Antimatter Dimensions. Are you sure you want to do this?",
  dbModalNoReset: `This will not actually reset anything due to an upgrade you have which prevents Antimatter and Antimatter Dimensions
from being reset in this situation. You will still gain the multiplier from the Boost, as usual.`,
  enterCelestialModalTitle: "$1aX Reality",
  enterCelestialModalEnterXReality: "Perform a Reality reset and enter $1aX Reality, in which:",
  enterCelestialModalTeresaNotDone: `You have not unlocked the reward for Teresa's Reality yet.
Unlocking the reward requires purchasing the Reality study and completing the Reality for the first time.`,
  enterCelestialModalTeresaDone: `Your highest Teresa completion was for $1aX$AM$$ , gaining you a $2aX multiplier to Glyph Sacrifice power.`,
  enterCelestialModalEffarigDone: "Effarig is completed!",
  enterCelestialModalEffarigLayerX: "You are currently on the Infinity Layer. $You are currently on the Eternity Layer. $ You are currently on the Reality Layer.",
  enterCelestialModalEnslavedNotDone: "We... can help... Let us... help...",
  enterCelestialModalEnslavedDone: "Have... we... not helped enough...",
  enterCelestialModalRa: `Within Ra's Reality, some resources will generate Memory Chunks for Celestial Memories based on their amounts:`,
  enterCelestialModalLaiThisTierNew: "You have not completed Lai'tela at this tier.",
  enterCelestialModalLaiThisTier: "Your fastest completions on this tier is $1aX",
  enterRaModalRegainedAllMemories: "$1aX has regained all Memories $ $1aX have regained all Memories",
  enterRaModalChunksBasedOn: "gain Memory Chunks based on $1aX $ gains Memory Chunks based on $1aX",
  dilationModalFirst: "This is your first Dilation",
  dilationModalTitle: "You are about to enter Dilation",
  dilationModalInfo: `Dilating time will start a new Eternity, and all Dimension multiplier's exponents and \
tickspeed multiplier's exponent will be reduced to $1aX. If you can Eternity while Dilated, \
your Tachyon Particles will be increased to a value based on your highest antimatter and any Tachyon Particle \
multipliers you have.`,
  dilationModalTeresaReward: `You already have the maximum feasible amount of Tachyon Particles you can attain due to
    Teresa's Level $1aX reward.`,
  dilationModalLastDilation: `You last completed Dilation at $1aX$EP$$.`,
  ep: "Eternity Point",
  eternityModalTitle_EC: "Complete Eternity Challenge",
  eternityModalTitle: "You are about to Eternity",
  eternityModalFirstEter: `Eternity will reset everything except Achievements, Challenge records, and anything under the General header
on the Statistics tab. You will also gain an Eternity Point and unlock various upgrades.`,
  eternityModalInfo: "Eternity will reset everything except Achievements, Challenge records, and anything under the General header on the Statistics tab.",
  eternityModalEternityGain: "You will gain $1aX$ETER$$ and $2aX$EP$$ on Eternity.",
  eternityModalStartNextEter: "You will start your next Eternity with $1aX$IP$$.",
  eternityModalECxMaxed: "Eternity Challenge $1aX is already fully completed",
  eternityModalNoBulk: "You will gain one completion of Eternity Challenge $1aX.",
  eternityModalBulkEcs: "You will gain $1aX$COMP$$ for Eternity Challenge $2aX",
  exitChallengeModalTitle: "You are about to exit $1aX $ You are about to restart $1aX",
  exitChallengeModalHigherLayer: "Other effects coming from higher-layer restrictions will still continue to apply.",
  exitChallengeModalRestart: "You will immediately re-enter $1aX again after confirming this modal.",
  exitChallengeModalExit: "This will place you back into a regular $1aX without any restrictions.",
  exitDilModalTitle_Doomed: "You cannot exit Dilation while Doomed",
  exitDilModalTitle: "You are about to exit Dilation",
  exitDilModalDoomed: `Dilation is permanent. You will not gain anything, but reset your current eternity. $ \
  Dilation is permanent. You will gain $1aX$TP$$ and reset your current eternity.`,
  exitDilModalNotDoomed: "If you exit Dilation now, you will not gain anything. $ If you exit Dilation now, you will gain $1aX$TP$$.",
  exitDilModalECexit: "You will also exit your current Eternity Challenge as well.",
  exitDilModalAreYouSure: "Are you sure you want to proceed?",
  hardResetModalTitle: "HARD RESET", // This is also used on the button that you actually click to hard reset.
  hardResetModalResetString: "Shrek is love, Shrek is life",
  hardResetModalConfirm: "Please confirm your desire to hard reset this save slot.",
  hardResetModalNoSecret: "Deleting your save will not unlock anything secret.",
  hardResetModalTypeInString: "Type in \"$1aX\" to confirm.",
  hardResetModalWillWipe: "THIS WILL WIPE YOUR SAVE.",
  hardResetModalRemovesCosmetics: "This will also remove any Glyph cosmetics you have unlocked from completing the game!",
  hardResetModalLoseSpeedrun: "You will lose the ability to do a Speedrun. To restart your run, use the \"Start Speedrun\" button instead.",
  hardResetModalConfirmedPhrase: "Phrase confirmed - continuing will irreversibly delete your save!",
  hardResetModalTypeIn: "Type in the correct phrase to hard reset.",
  realityModalTitle: "You are about to Reality",
  realityModalFirstReality: `Reality will reset everything except Challenge records and anything under the General header on the \
Statistics tab. The first $1aX rows of Achievements are also reset, but you will automatically get one Achievement back every \
$2aX. You will also gain Reality Machines based on your Eternity Points, a Glyph with a level based on your Eternity Points, \
Replicanti, and Dilated Time, a Perk Point to spend on quality of life upgrades, and unlock various upgrades.`,
  realityModalNoSTART: `You currently only have a single option for new Glyphs every Reality. You can unlock the ability \
  to choose from multiple Glyphs by canceling out of this modal and purchasing the START Perk.`,
  realityModalChoosePreFilter: "You must select a Glyph in order to continuue",
  realityModalChoosePostFilter: "If you do not choose a Glyph, one will be automatically selected using your Glyph filter.",
  realityModalWillGainX: "You will gain $1aX$PP$$, $2aX$RM$$ and $3aX$REAL$$ $ You will gain $1aX$PP$$, $2aX$RM$$, $3aX$REAL$$ and $4aX$RELIC$$",
  realityModalLevelStat: `You will get a level $1aX Glyph on Reality, which is equal to your best. $ \
  You will get a level $1aX Glyph on Reality, which is $1aX higher than your best $ \
  You will get a level $1aX Glyph on Reality, which is $1aX lower lower your best`,
  realityModalSimulateNoteA: "After choosing this Glyph the game will simulate the rest of your Realities,",
  realityModalSimulateNoteB: "acutomtically choosing another $1aX$GLY$$ based on your Glyph filter settings.",
  realityModalAutoPurgeA: "Auto-purge is currently enabled; your selected Glyph",
  realityModalAutoPurgeB: "may not appear in your inventory after it triggers",
  realityModalMoreSimThanInventory: `You will be simulating more Realities than you have open inventory space for;
this may result in some Glyphs being Sacrificed`,
  realityModalNoSpace: `You do not have any free inventory space - your selected Glyph will be automatically sacrificed! $ \
  You do not have any free inventory space - your selected Glyph will be automatically refined! $ \
  You do not have any free inventory space - your selected Glyph will be automatically deleted!`,
  realityModalForceToShow: "You can force this modal to appear (even if disabled) by Shift-clicking the Reality button.",
  realityModalSacrificeButton: "Sacrifice",
  rgModalTitle: "You are about to purchase $1aX$RGAL$$",
  rgModalMessage: `A Replicanti Galaxy boosts Tickspeed the same way an Antimatter Galaxy does. However, it does not
increase the cost of Antimatter Galaxies, nor is it affected by multipliers to Antimatter Galaxies specifically.`,
  rgModalDevideRep: "It will divide your Replicanti by $1aX for each Replicanti Galaxy purchased ($2aX to $3aX)",
  rgModalResetRep: "It will reset your Replicanti to $1aX",
  resetRealityModalTitles: "You are about to reset your Reality $ You are about to reset your Armageddon",
  resetRealityModalWillReset: `This will reset you to the start of your Reality giving you no rewards from your progress in your current Reality. $ \
  This will reset you to the start of your Armageddon giving you no rewards from your progress in your current Armageddon.`,
  resetRealityModalCanReality: `You can currently complete a Reality for all its normal rewards, \
  which you will not receive if you Reset here. To get rewards, use the "Make a new Reality" button.`,
  resetRealityModalAreYouSure: "Are you sure you want to proceed?",
  studyPreviewModalUnavailable: "Preview Unavailable", // Up to here
  editAuto: "Edit Autobuyers",
  noAutos: "You currently have no autobuyters which could be shown here",
  usingModalEditAuto: "Using this modal, you can edit various values inside your autobuyers.",
  cantGenTemplate: "Cannot generate template (You have $1aX)",
  invIn: "invalid input",
  automatorNTemlate: "$1aX Template",
  reqInfo: "Required Information:",
  usePresetST: "Use a preset Study Tree:",
  currentTree: "Current Tree",
  possibleConsider: "Possible things to consider:",
  ifSomethingWrong: "(If something seems wrong with the template inputs, it will show up here)",
  tempCopied: "Template copied to clipboard",
  yourXactivatedY: "Your $1aX activated $2aX",
  expo: "exponent ", // Space here is important
  xIncreased: "$1aX $2aXincreased from $3aX to $4aX", // Lack of space between $2aX and text is important
  time: "time",
  whileAwayFor: "While you were away for $1aX:",
  whileAwayForAlt: "While you were away for $1aX... Nothing happened.",
  hideNote: "Note: Click an entry to hide it in the future",
  breakInfHeader: "You are Breaking Infinity",
  breakInfBaseText: `Breaking Infinity will allow you to gain antimatter past $1aX$2aX
Dimensions and Tickspeed Upgrades will scale in cost faster after $1aX antimatter.
You will gain additional Infinity Points on Big Crunch based on antimatter produced over $1aX.$3aX`,
  breakInfExtraA: ".$, and allow you to read numbers past $1aX",
  breakInfExtraB: "\nIt will also unlock Break Infinity Upgrades and max all Normal Challenge Autobuyers.",
  break: "Break",
  changelog: "Changelog",
  xUpd: "\"$1aX\" update",
  changeNameHeader: "Change your Speedrun Player Name",
  changeNameTextA: "This can no longer be changed once the timer starts, and there is a limit of $1aX characters.",
  changeNameTextB: "Your new name will be $1aX",
  changeName: "Change Name",
  delConst: "Deleting Automator Constants",
  delConstTextA: "Are you sure you wish to delete all of your currently-defined automator constants?",
  delConstTextB: "This will irreversibly delete $1aX!",
  constant: "constant",
  delAll: "Delete All",
  ad: "Antimatter Dimensions",
  delScript: "Delete this script",
  delScriptText: "Please confirm your desire to delete this Automator script.",
  del: "Delete",
  year: "year",
  namelessCracks: "Cracks in The Nameless Ones' Reality",
  realityResist: "This Reality seems to be resisting your efforts to complete it. So far you have done the following:",
  haveNotFigured: "You have not figured out what this hint means yet.",
  foundCrack: "You have exposed a crack in the Reality:",
  canSpendTime: `You can spend some time looking for some more cracks in the Reality, but every hint you spend Stored Time on
will increase the Stored Time needed for the next by a factor of $1aX. This cost bump will
gradually go away over $2aX hours and figuring out what the hint means will immediately
divide the cost by $3aX. The cost can't be reduced below $4aX years.`,
  nextHint: "The next hint will cost $1aX of Stored Time. You currently have $2aX.",
  timeToReach: "You will reach this if you charge your Black Hole for $1aX.",
  getRealityHint: "Get a hint about the Reality itself ($1aX left)",
  getGlyphHint: "Get a hint on what Glyphs to use ($1aX left)",
  noHints: "There are no more hints left!",
  delGlyphSet: "Delete this Glyph Set",
  confirmDelGlyphSet: "Please confirm your desire to delete this Glyph Set:",
  willNotDelGlyphs: "This will not affect your actual Glyphs, only the saved preset.",
  projGlyphLevel: "Projected Glyph Level: $1aX",
  h2p: "How To Play",
  importASD: "Import Automator Script Data",
  newScript: "This will create a new Automator script at the end of your list.",
  newScriptExtraData: "This will also import additional data related to the script.",
  scriptName: "Script name: $1aX",
  lineCount: "Line count: $1aX",
  studyPresets: "Study Presets:",
  presetSlotX: "Preset slot #$1aX",
  presetSlotXAlt: `"$1aX" (slot $2aX)`,
  overwrittenPresets: "$1aX of your existing presets will be overwritten by imported presets!",
  consts: "Constants:",
  overwrittenConsts: "Some of your existing constants will be overwritten!",
  constLim: "$1aX will not be imported due to the $2aX constant limit.",
  scriptHasErrors: "This script has errors which need to be fixed before it can be run!",
  someErrFix: "Some errors may be fixed with the additional data being imported.",
  invalidADS: "Invalid Automator data string",
  ignorePresets: "Will Ignore Presets",
  ignoreConst: "Will Ignore Constants",
  impPresets: "Will Import Presets",
  impConst: "Will Import Constants",
  import: "Import",
  impGFS: "Import Glyph filter settings",
  GFSoverwrite: "Note: Importing Glyph filter options will overwrite settings$in all filter modes, not just the currently-selected one",
  mouseover: "Mouseover each box for more details. ✔ and ✘ symbols denote an effect selected/unselected for Specified Effect mode.",
  selMode: "Selection mode:",
  effCount: `Effect Count ("Number of Effects"):`,
  rejGlyph: "Rejected Glyphs:",
  typeSpec: "Type-specific Settings",
  invalidGFS: "Not a valid Glyph filter string",
  minEff: "Minimum Effects: $1aX",
  score: "Score: $1aX",
  noChanges: "(No changes)",
  rarityFilterTT: "Setting for Rarity Threshold and Specified Effect",
  effectCountFilterTT: "Number of effects in Specified Effect",
  scoreFilterTT: "Threshold for Effect Score",
  saveFromFuture: "This save is from $1aX in the future.",
  saveFromPast: "This save was last opened $1aX ago.",
  opImported: "Using imported save settings",
  opLocal: "Using existing save settings",
  opIgnored: "Will not simulate offline time",
  opErr: "Unrecognised offline progress setting for importing",
  willImpWOoffline: "Save will be imported without offline progress",
  wontApplyOffline: "This setting will not apply any offline progress after importing.",
  noOfflineFuture: "Offline progress cannot be simulated due an inconsistent system clock time.",
  tickCalc: "After importing, will simulate $1aX ticks of duration $2aX each.",
  fileName: "File name: $1aX",
  saveAM: "Antimatter: $1aX",
  saveInf: "Infinities: $1aX",
  saveEter: "Eternities: $1aX",
  saveReal: "Realities: $1aX",
  saveComps: "Full game completions: $1aX",
  willOverride: "(Your current save file will be overwritten!)",
  saveOP: "Offline Progress: $1aX",
  invalidSave: "Not a valid save:",
  willLoseCosmeticsA: "Glyph cosmetic sets form compeleting the game are tied to your save.",
  willLoseCosmeticsB: "Importing this save will cause you to lose some sets.",
  willLoseSpeedrun: "You will lose the ability to do a Speedrun, as this save does not have it unlocked.",
  inputSave: "Input your save",
  importTSConstHeader: "Importing Time Study Presets as Constants",
  iTSCtextA: `Confirming this modal will import all of your saved Time Study presets as new Automator constants.
Below are all the valid presets which will be imported, with the beginning and end of their contained
studies shown. Some names may be changed due to restrictions on constant name formatting.`,
  nameAtoB: "Name: $1aX ➜ $2aX",
  willOverwriteExistingConst: "This will overwrite an existing constant!",
  cantImportX: "$1aX in this list cannot be imported due to the limit on constant count",
  impAll: "Import All",
  preset: "preset",
  aboutGame: "About the game",
  infoModalText: `Antimatter Dimensions is an Idle Incremental game created by Finnish developer Hevipelle. Originating as a solo
project in 2016, it was expanded upon by a large team of developers and testers from then on.$The
game has unfolding gameplay and multiple prestige layers. The "How to Play" button contains useful information about
progressing.$The Break Eternity port is a port intended to allow modders to extend the vanilla game beyond e9e15 by using a new
library aswell as other changes, such as better glyph handing. The repository link here has been changed
appropriately.`,
  ghRepo: "GitHub repository",
  adserv: "Antimatter Dimensions Discord Server",
  adgp: "Antimatter Dimensions on Google Play",
  adstm: "Antimatter Dimensions on Steam",
  cred: "Credits",
  changelog: "Game Changelog",
  saveX: "Save #$1aX:",
  selected: "(selected)",
  saveSelect: "Save Selection",
  message: "Message",
  dontShowAgain: "Don't show this message again",
  remaining: "Remaining: $1aX",
  cancel: "Cancel",
  modGRNG: "Modifying Glyph RNG Seed",
  modGRNGTextA: `All Glyph options beyond the first Reality for an entire playthrough are randomly determined from the very
beginning, based on the value of an initial seed number. The role of this seed is that it chooses a single,
particular set of Glyph options for your playthrough. If you or anyone else chooses the same seed
in a different run, you will get the same options for Glyphs.`,
  canSwitch: "You can switch between these three options any point before you generate your first Glyph.",
  currentSetting: "Current Setting: $1aX",
  oPS: "Official Preset Seed",
  thisDefault: "This is the default option which chooses the seed $1aX. Anyone who chooses to not modify the seed at all will get these Glyph options.",
  rS: "Randomized Seed",
  rStxt: `This selects a completely randomized seed value, producing Glyph options which are very likely to be different from anyone else's
  playthrough unless they intentionally chose the same value.`,
  cantInputZero: "Input seed cannot be zero!",
  pSS: "Player-selected Seed:",
  pSStxt: "This option sets your seed to the value you type into the text box.",
  replaceInput: "Your current input will be $1aX the number $2aX",
  convUsed: "converted to$used as",
  inputDefualt: "Your current input $1aX 0; the seed will default to Official Preset.",
  convUsedAlt: "converts to$is equal to",
  techReasons: "For technical reasons, the value must be non-zero to be accepted.",
  // Yes this is a modal so it goes here. It sucks. Deal with it.
  pelleNerfList: `
  Anything unlocked through a Pelle upgrade cannot be unlocked normally $ \
  All pre-Doomed IP and EP multipliers are disabled $ \
  IP generation based on fastest infinity speed is disabled $ \
  All pre-Doomed Replicanti speed multipliers are disabled $ \
  Replicanti slows down more drastically above $1aX $ \
  Most Eternity Challenges are harder $ \
  All Galaxies are only $2aX as effective $ \
  Antimatter Dimension Multiplier is divided by $3aX $ \
  Achievement multiplier and many achievement rewards are disabled $ \
  Black Holes are disabled $ \
  Reality Upgrade "Temporal Transcendence" is disabled $ \
  All rewards which increase your starting resources except Achievement 21 are disabled $ \
  All rewards which prevent resources from being reset are disabled $ \
  Perk rewards which reduce unlock costs have been disabled, excluding the ECR group $ \
  Automatic Infinity and Eternity Challenges are disabled $ \
  All Dimension and pre-Infinity Autobuyers are disabled until reacquired through Pelle $ \
  The Time Theorem Autobuyer is disabled $ \
  All Automation related to Time Dilation or later is disabled $ \
  Eternity Upgrade to Time Dimensions based on days played is based on this Armageddon time $ \
  All pre-Doomed Dilated Time multipliers are disabled except the $4aX buyable $ \
  All Tachyon Particle multipliers are disabled $ \
  All pre-Doomed Time Theorem generation effects are disabled except the Dilation upgrade $ \
  Glyph equipping is disabled until reacquired $ \
  Glyph levels are lowered and rarity is set to $5aX $ \
  Effects from Glyph Sacrifice, Alteration, and Alchemy are all disabled $ \
  You cannot enter any other Celestial Realities $ \
  Music Glyphs cannot be bought $ \
  All rewards from Effarig are disabled $ \
  All features related to storing time are disabled $ \
  All rewards from V are disabled $ \
  The Teresa Level $6aX effect from Ra is disabled $ \
  Infinity Upgrades cannot be charged $ \
  Triad Studies and Space Theorems are disabled $ \
  Imaginary Upgrades are disabled excluding those relating to DMD's and Celestial unlocks $ \
  Continuum and Singularity rewards are disabled`,
  listOfDisabled: "List of disabled and nerfed effects in Doomed",
  realGlyphCreation: "Reality Glyph Creation",
  rgcText: `Create a level $1aX Reality Glyph. Rarity will always be $2aX and
  level scales on your current Reality Resource amount (which is all consumed). All other Alchemy Resources will
  be unaffected. Reality Glyphs have unique effects, some of which are only available with higher level Glyphs.
  Reality Glyphs can also be sacrificed to increase all Memory Chunk gain. Like Effarig Glyphs,
  you cannot equip more than one at the same time.`,
  availableEffects: "Available Effects:",
  noRealDoomed: "You cannot create Reality Glyphs while Doomed",
  makeReal: "Create a Reality Glyph!",
  gtZero: "Reality Glyph level must be higher than $1aX",
  noInvSpaceB: "No available inventory space; Sacrifice some Glyphs to free up space.",
  reqGlX: "(Requires Glyph level $1aX)",
  aboutToReplace: "You are about to replace a Glyph",
  willRestart: "Replacing a Glyph will restart this $1aX",
  dimSac: "Dimensional Sacrifice",
  hasAchSacrifice: `Dimensional Sacrifice will give you a boost to the 8th Antimatter Dimension based on the amount of
  1st Antimatter Dimensions you had at the time of Sacrificing.`,
  noAchSacrifice: `Dimensional Sacrifice will remove all of your 1st through 7th Antimatter Dimensions
  (with the cost and multiplier unchanged), for a boost to the 8th Antimatter Dimension based on the total
  amount of 1st Antimatter Dimensions sacrificed. It will take time to regain production.`,
  dsMultText: "Multiplier is currently $1aX and will increase to $2aX on Dimensional Sacrifice",
  singMilestoneGroupResource: "Singularity Count$Condense Count$Manual Time$Auto Time",
  singMilestoneGroupSort: "Singularities needed$Current Completions$Progress to full completion$Final Singularities$Most Recent",
  singMilestoneGroupCompleted: "First$Last$Don't move",
  ascDesc: "Ascending$Descending",
  singMile: "Singularity Milestones",
  toggleGlow: "Make button glow when new milestones have been reached",
  toMile: "To Milestone:",
  sortBy: "Sort By:",
  compMile: "Completed Milestones:",
  sortOrder: "Sort Order:",
  enterSpeedrun: "Entering Speedrun Mode",
  speedrunTextA: `This will start a save with additional statistics tracking for when you reach certain points of
  the game. These will be visible in the bottom-right of the screen and on a dedicated subtab of Statistics.`,
  speedrunTextB: `Almost all animations and confirmations are disabled by default, but you can change any of these settings before
  you reach their required progression. When you begin the run, the game remains paused until
  your antimatter changes, allowing you to configure all your settings before starting. In order to avoid having
  to wait for a long time before actually starting an optimized run, a few achievements are given for free.`,
  speedrunTextC: "There is no additional content in Speedrun Mode.",
  speedrunTextD: `You can type in text below to name your speedrun save. This will have no effects on gameplay and only identifies
  this particular save as yours. If no name is given, a random name will be generated instead. This name can be
  changed by clicking your name in the speedrun info box, as long as the timer has not started yet.`,
  speedrunTextE: `Speedrun saves can be imported and exported like regular saves. Importing a speedrun save will mark it as a
  Segmented run, as importing and exporting allows for optimization of individual segments of the game.
  Without importing, saves will remain as Single-segment runs.`,
  speedrunTextF: "You can modify the Glyph RNG seed in the Options tab before starting your run, if desired.",
  speedrunTextG: `Starting a speedrun will reset your save to the beginning of the game. Some things will remain, such as
  full-game completion stats, visual settings, automator scripts, and Glyph cosmetics, but otherwise it
  will be as if you had just finished the entire game and chose to restart at the credits screen. Type
  in "Gotta Go Fast!" below to confirm and (re)start the run.`,
  continue: "Continue",
  startRun: "Start Run!",
  emptyCurrent: "into an empty Tree$with your current Tree",
  notPurchase: "Importing this $1aX will not purchase any new Time Studies.",
  importWill: "Importing $1aX will purchase:",
  cost: "(Cost: $1aX)",
  delStudyPreset: "Deleting Study Preset \"$1aX\"",
  invalidImportStr: "Your import string has invalid study IDs: $1aX <br><br>",
  inputTree: "Input your tree",
  editTree: "Editing Study Preset \"$1aX\"",
  save: "Save",
  successEdit: "Study Tree \"$1aX\" successfully edited.",
  presetNamed: "Study preset \"$1aX\"",
  presetUnnamed: "Study preset",
  presetDeleted: "$1aX deleted from slot $2aX",
  presetHas: "Study Preset contains:",
  noLoadStatus: "Status after loading with <b>no studies</b>:",
  loadStatus: "Status after loading with <b>current tree</b>:",
  invalidTree: "Not a valid tree",
  formatPreset: "Format Preset Text",
  formatPresetHover: "This will format the study preset text, for example, changing 'a,b,c|d' to 'a, b, c | d'.",
  cantEterRN: "You are currently unable to eternity, so this will only do a normal load.",
  respecAndEter: "Also respec tree and eternity",
  dimSplit: "Dimension Split: $1aX",
  paceSplit: "Pace Split: $1aX",
  ec: "Eternity Challenge $1aX",
  willStart: " (will start)",
  UImodalEntries: `
  Many more game events now have animations. If these impact your performance or gameplay, they can be disabled in the Visual Options tab.$
  New confirmation windows have replaced the default Javascript alert windows. These can be disabled in the Gameplay Options tab.$
  The game now also has a new sleek layout which was designed with more Modern design practices in mind.`,
  visualChanges: "Visual Changes",
  oldSaveLoad: "We noticed that you've loaded an old save; a few visual changes have been made since older versions of the game:",
  changeAnytine: `You can change between the Classic UI which older versions of the game used and the newer Modern UI in the Visual
  Options tab at any time. Would you like to swap to the Modern UI now?`,
  remain: "Remain",
  swap: "Swap",
  aboutToUndo: "You are about to undo equipping a Glyph",
  lastRemoved: "The last equipped Glyph will be removed. Reality will be reset, but some things will be restored to what they were when it was equipped:",
  undoList: `<br>- Antimatter, Infinity Points, and Eternity Points$
  <br>- Dilation Upgrades, Tachyon Particles, and Dilated Time$
  <br>- Time Theorems and Eternity Challenge completions$
  <br>- Time Dimension and Reality unlocks$
  <br>- Time in current Infinity/Eternity/Reality$
  <br>- Stored game time`,
  invalidStayInvalid: `Note that if you invalidate special requirements for certain things (such as the achievement for completing
  a Reality without producing antimatter), they will remain invalid even after undoing. In those cases, you will
  need to complete the conditions in a single Reality without using undo.`,
  conditionLockHeaader: "$1aX Condition Lock",
  areYouSureCondition: "Are you sure you wish to $1aX? Doing this right now will cause you to$fail the requirement for the $2aX \"$3aX\"",
  selectCancel: `Selecting "Cancel" will close this modal with no effect, while selecting "Disable Lock" will disable the
  requirement check for this upgrade and prevent this message from reappearing unless you turn it back on.`,
  neitherPerform: "Neither of these options will perform the action you just attempted, so you will need to try again",
  disableLock: "Disable Lock",
  iUrU: "Imaginary Upgrade$Reality Upgrade",
  glyphUndoOnly: "Glyph Undo can only undo with a Reality!",
  noChangeSeed: "You cannot modify your seed any more. Glyph RNG has already been used to generate at least one Glyph on this run.",
  tsNoStudies: "This Time Study lists currently contains no Time Studies",
  crash: "$1aX<br>Check the console for more details",
  causedExit: "$1aX, which has caused you to exit it.",
  amAnnihilation: "Your $1aX antimatter was annihilated by $2aX matter.",
  invalidPerks: "Some of your Perks were invalid, but you auto-bought all valid perks.",
  invalidPerksAlt: "Some of your Perks were invalid, so your Perks have been reset and your Perk Points refunded.",
  noInvSpaceC: "No available inventory space; free up space by shift-clicking Glyphs to get rid of them.",
  unlockedSpeedrun: `You have unlocked Speedrun Mode! This allows you to start a new save file with some slight
      changes which can be helpful if you're trying to complete the game as quickly as possible. The option to
      start a Speedrun Save is now available in the Options tab, under Saving. Choosing to start a Speedrun Save
      will provide you with another modal with more in-depth information.`,
  animatedTheme: "This secret theme has animations. If they are giving you performance issues, you can turn them off in the Options/Visual tab to reduce lag",
  tdBeforett: "You need to buy at least $1aX Time Dimension before you can purchase Time Theorems.",
  subMinuteInf: `Since you performed an Infinity in under a minute, the UI changed on the screen.
    Instead of the Dimensions disappearing, they stay and the Big Crunch button appears on top of them.
    This is purely visual, and is there to prevent flickering.`,
  alrShownCrack: "You have already exposed this crack in the Reality. Time in this Eternity is being multiplied by your Eternity count, up to a maximum of $1aX",
  feelEter: "Time in this Eternity will be multiplied by your Eternity count, up to a maximum of $1aX",
  doomUnequip: "Dooming your Reality will unequip your Glyphs. Some of your Glyphs could not be unequipped due to lack of inventory space.",
  doomSpace: "You must have enough empty unprotected Glyph slots for $1aX additional Glyphs in order to Doom your Reality",
  refresh: "Refresh the page (game will be saved) we've got new stuff: $1aX by $2aX",
  onlyOneXGlyph: "You may only have one $1aX Glyph equipped!",
  cantUEallGlyphs: "$1aX could not be unequipped due to lack of space. Free up some space in your $2aX in order to unequip $3aX",
  opt: "Protected slots$Main Inventory$ or switch where you are equipping to",
  itthem: "it$them",
  noInvSpaceD: "No available inventory space; Sacrifice some Glyphs to free up space.",
  cantUEinv: "Some of your Glyphs could not be unequipped due to lack of inventory space.",
  cantLoadSave: "Could not load the save (format unrecognized or invalid).",
  rmLimited: `Reality Machine gain for your first Reality is reduced above $1aX Eternity Points and capped at $2aX Eternity Points.
  This is due to balance changes made in the Reality update which affect the difficulty of reaching those amounts,
  such as the increased Time Dimension cost scaling above $3aX.`,
  importOptionsFilename: "File Name: $1aX",
  importOptionsNotation: "Notation: $1aX",
  importOptionsLNotation: "Large Notation: $1aX",
  importOptionsTheme: "Theme: $1aX",
  importOptionsUI: "UI Type: $1aX",
  importOptionsLanguage: "Language: $1aX ($2aX)",
  importOptionsOverride: "(Your current settings will be overwritten!)",
  importOptionsInvalidSettings: "Invalid settings import:",
  importOptionsFailStrings: `
  $Import does not contain a save file name
  $Import does not choose a notation
  $Import does not choose a large notation
  $Import does not choose a UI
  $Import does not have valid Classic or Modern Themes
  $Import does not specify a language
  $Invalid import
  `
};