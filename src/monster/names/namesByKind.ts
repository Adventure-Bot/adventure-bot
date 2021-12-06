import { banditNames } from "./bandit";
import { MonsterKind } from "./getRandomMonsterName";
import { goblinNames } from "./goblin";
import { orcNames } from "./orc";
import { zombieNames } from "./zombie";
import { demonNames } from "./demon";

export const namesByKind = new Map<MonsterKind, string[]>([
  ["Goblin", goblinNames],
  ["Orc", orcNames],
  ["Bandit", banditNames],
  ["Zombie", zombieNames],
  ["Demon", demonNames],
]);
