import { GameMechanicState } from "./game-mechanic";

/**
 * @abstract
 */
export class ArrayUpgradeState extends GameMechanicState {
  /**
   * @abstract
   */
  get array() { throw new NotImplementedError(); }
  set array(value) { throw new NotImplementedError(); }

  get isUnlocked() {
    return this.array.includes(this.id);
  }

  get canBeApplied() {
    return this.isUnlocked && this.isEffectActive;
  }

  get canBeUnlocked() {
    return !this.isUnlocked;
  }

  // eslint-disable-next-line no-empty-function
  onUnlock() { }

  unlock() {
    if (!this.canBeUnlocked || this.isUnlocked) return;
    this.array.push(this.id);
    this.onUnlock();
  }

  lock() {
    if (!this.isUnlocked) return;
    this.array.pop(this.array.find(this.id));
  }
}
