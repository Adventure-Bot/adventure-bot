import { banditNames } from "./bandit";
import { MonsterKind } from "./getRandomMonsterName";
import { goblinNames } from "./goblin";
import { orcNames } from "./orc";
import { slimeNames } from "./slimeNames";

export const namesByKind = new Map<MonsterKind, string[]>([
  ["goblin", goblinNames],
  ["orc", orcNames],
  ["bandit", banditNames],
  ["slime", slimeNames],
]);
