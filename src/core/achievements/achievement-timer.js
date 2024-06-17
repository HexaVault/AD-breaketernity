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
      ? Time.realDeltaTime.totalSeconds
      : Time.trueDeltaTime.totalSeconds;
    this.time = this.time.add(addedTime);
  }

  check(condition, duration) {
    if (!condition) {
      this.reset();
      return false;
    }
    this.advance();
    return this.time.gte(duration);
  }
}

export const AchievementTimers = {
  marathon1: new AchievementTimer(false),
  marathon2: new AchievementTimer(false),
  pain: new AchievementTimer(true),
  stats: new AchievementTimer(true)
};
