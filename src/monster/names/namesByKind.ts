import { MonsterKind } from "./getRandomMonsterName";
import { goblinNames } from "./goblin";
import { zombieNames } from "./zombie";
import { demonNames } from "./demon";
import { slimeNames } from "./slimeNames";

export const namesByKind = new Map<MonsterKind, string[]>([
  ["Goblin", goblinNames],
  ["Zombie", zombieNames],
  ["Demon", demonNames],
  ["Slime", slimeNames],
]);
