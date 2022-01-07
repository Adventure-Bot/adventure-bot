import { MonsterKind } from "./getRandomMonsterName";
import { goblinNames } from "./goblin";
import { zombieNames } from "./zombie";
import { demonNames } from "./demon";
import { slimeNames } from "./slimeNames";
import { dragonNames } from "./dragon";

export const namesByKind = new Map<MonsterKind, string[]>([
  ["Goblin", goblinNames],
  ["Zombie", zombieNames],
  ["Demon", demonNames],
  ["Slime", slimeNames],
  ["Dragon", dragonNames],
]);
