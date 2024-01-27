import { DC } from "../constants";

class AchievementTimer {
  constructor(isRealTime) {
    this.time = DC.D0;
    this.realTime = isRealTime;
  }

  reset() {
    this.time = DC.D0;
  }

  advance() {
    const addedTime = this.realTime
      ? Time.unscaledDeltaTime.totalSeconds
      : Time.deltaTime;
    this.time = this.time.add(addedTime);
  }

  check(condition, duration) {
    if (!condition) {
      this.reset();
      return false;
    }
    this.advance();
    return this.time >= duration;
  }
}

export const AchievementTimers = {
  marathon1: new AchievementTimer(false),
  marathon2: new AchievementTimer(false),
  pain: new AchievementTimer(true),
  stats: new AchievementTimer(true)
};
