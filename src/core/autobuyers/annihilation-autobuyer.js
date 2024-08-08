import { AutobuyerState } from "./autobuyer";

export class AnnihilationAutobuyerState extends AutobuyerState {
  get data() {
    return player.auto.annihilation;
  }

  get name() {
    return `Annihilation`;
  }

  get isUnlocked() {
    return SingularityMilestone.annihilationAutobuyer.canBeApplied;
  }

  get multiplier() {
    return this.data.multiplier;
  }

  set multiplier(value) {
    this.data.multiplier = value;
  }

  get bulk() {
    return 0;
  }

  get hasInput() {
    return true;
  }

  get inputType() {
    return "decimal";
  }

  get inputEntry() {
    return "multiplier";
  }

  tick() {
    if (Laitela.darkMatterMultGain.gte(this.multiplier)) {
      Laitela.annihilate();
    }
  }
}
