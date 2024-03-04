export const END_STATE_MARKERS = {
  // Tab zalgoification starts as soon as endState > 0
  GAME_END: 1,
  TAB_START_HIDE: 1.5,
  INTERACTIVITY_DISABLED: 2.5,
  FADE_AWAY: 2.5,
  SAVE_DISABLED: 4,
  END_NUMBERS: 4.2,
  CREDITS_START: 4.5,
  SHOW_NEW_GAME: 13,
  SPECTATE_GAME: 13.5,
  CREDITS_END: 14.5,
};

export const GameEnd = {
  get endState() {
    if (this.removeAdditionalEnd) return this.additionalEnd;
    let x = 0
    if (player.celestials.pelle.records.totalAntimatter.mag >= 2 && player.bypassEnd != true) {
      x = player.celestials.pelle.records.totalAntimatter.max(1).log10().sub(9e15).min(5000).toNumber()
    }
    return Math.max(x, 0);
  },

  _additionalEnd: 0,
  get additionalEnd() {
    return (player.isGameEnd || this.removeAdditionalEnd) ? this._additionalEnd : 0;
  },
  set additionalEnd(x) {
    this._additionalEnd = (player.isGameEnd || this.removeAdditionalEnd) ? x : 0;
  },

  removeAdditionalEnd: false,

  creditsClosed: false,
  creditsEverClosed: false,

  gameLoop(diff) {
    if (diff instanceof Decimal) {
      diff = diff.toNumber()
    }
    if (this.removeAdditionalEnd) {
      this.additionalEnd -= Math.min(diff / 200, 0.5);
      if (this.additionalEnd < 4) {
        this.additionalEnd = 0;
        this.removeAdditionalEnd = false;
      }
    }
    if (!(this.removeAdditionalEnd) && this.endState > END_STATE_MARKERS.GAME_END &&
        ui.$viewModel.modal.progressBar === undefined) {
      player.isGameEnd = true;
      this.additionalEnd += Math.min(diff / 1000 / 20, 0.1);
    }
  }
};
