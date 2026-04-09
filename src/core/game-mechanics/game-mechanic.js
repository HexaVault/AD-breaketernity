import { Effect } from "./effect";

/**
 * @abstract
 */
export class GameMechanicState extends Effect {
  constructor(config) {
    super(config);
    if (config.effects !== undefined) {
      this.effects = {};
      for (const key in config.effects) {
        const nested = config.effects[key];
        const effect = new Effect(isConstant(nested) || isFunction(nested) ? { effect: nested } : nested);
        Object.defineProperty(effect, "isEffectActive", {
          configurable: false,
          get: () => this.isEffectActive
        });
        this.effects[key] = effect;
      }
    }
  }

  get id() {
    return this.config.id;
  }

  registerEvents(events, callback) {
    if (events === undefined) return;
    for (const event of handlePossibleArray(events)) {
      EventHub.logic.on(event, callback, this);
    }
  }

  static createAccessor(gameData) {
    const index = mapGameData(gameData, config => new this(config));
    const accessor = id => index[id];
    accessor.index = index;
    return accessor;
  }
}
