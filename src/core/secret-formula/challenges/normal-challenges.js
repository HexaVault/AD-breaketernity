// I tried to make it relatively simple to add more locks; the idea is that you give it a value here
// and then it's all handled in the backend
// If you need to lock a challenge, set lockedAt to a new Decimal variable reflective of a desired number of Infinities
// They will always be unlocked post-eternity

export const normalChallenges = [
  {
    id: 1,
    legacyId: 1,
    isQuickResettable: false,
    description() {
      return PlayerProgress.eternityUnlocked()
        ? i18n("chall", "nc1")
        : i18n("chall", "nc1noeter");
    },
    name: "1st Antimatter Dimension Autobuyer",
    reward: () => i18n("chall", "nc1rew"),
    lockedAt: DC.D0,
  },
  {
    id: 2,
    legacyId: 2,
    isQuickResettable: false,
    description: () => i18n("chall", "nc2", [() => formatInt(3)]),
    name: "2nd Antimatter Dimension Autobuyer",
    reward: () => i18n("chall", "nc2rew"),
    lockedAt: DC.D0,
  },
  {
    id: 3,
    legacyId: 3,
    isQuickResettable: false,
    description: () => i18n("chall", "nc3"),
    name: "3rd Antimatter Dimension",
    reward: () => i18n("chall", "nc3rew"),
    lockedAt: DC.D0,
  },
  {
    id: 4,
    legacyId: 8,
    isQuickResettable: false,
    description: () => i18n("chall", "nc4"),
    name: "4th Antimatter Dimension Autobuyer",
    reward: () => i18n("chall", "nc4rew"),
    lockedAt: DC.D0,
  },
  {
    id: 5,
    legacyId: 6,
    isQuickResettable: false,
    description: () => i18n("chall", "nc5", [() => formatX(1.080, 0, 3), () => formatX(1.1245, 0, 3)]),
    name: "5th Antimatter Dimension Autobuyer",
    reward: () => i18n("chall", "nc5rew"),
    lockedAt: DC.D0,
  },
  {
    id: 6,
    legacyId: 10,
    isQuickResettable: false,
    description: () => i18n("chall", "nc6", [() => formatInt(2)]),
    name: "6th Antimatter Dimension Autobuyer",
    reward: () => i18n("chall", "nc6rew"),
    lockedAt: DC.D0,
  },
  {
    id: 7,
    legacyId: 9,
    isQuickResettable: false,
    description: () => i18n("chall", "nc7", [() => formatInt(10), () => formatX(1),
      () => formatX(0.2, 1, 1), () => formatX(2)]),
    name: "7th Antimatter Dimension Autobuyer",
    reward: () => i18n("chall", "nc7rew"),
    lockedAt: DC.D0,
  },
  {
    id: 8,
    legacyId: 11,
    isQuickResettable: false,
    description: () => i18n("chall", "nc8"),
    reward: () => i18n("chall", "nc8rew"),
    lockedAt: DC.D0,
  },
  {
    id: 9,
    legacyId: 5,
    isQuickResettable: true,
    description: () => i18n("chall", "nc9", [() => formatInt(10)]),
    name: "Tickspeed Autobuyer",
    reward: () => i18n("chall", "nc9rew"),
    lockedAt: DC.D0,
  },
  {
    id: 10,
    legacyId: 4,
    isQuickResettable: false,
    description: () => i18n("chall", "nc10", [() => formatInt(6)]),
    name: "Automated Dimension Boosts",
    reward: () => i18n("chall", "nc10rew"),
    lockedAt: DC.D16,
  },
  {
    id: 11,
    legacyId: 12,
    isQuickResettable: true,
    description: () => i18n("chall", "nc11", [() => formatInt(1)]),
    name: "Automated Antimatter Galaxies",
    reward: () => i18n("chall", "nc11rew"),
    lockedAt: DC.D16,
  },
  {
    id: 12,
    legacyId: 7,
    isQuickResettable: false,
    description: () => i18n("chall", "nc12", [() => formatInt(2), () => formatInt(2)]),
    name: "Automated Big Crunches",
    reward: () => i18n("chall", "nc12rew"),
    lockedAt: DC.D16,
  }
];
