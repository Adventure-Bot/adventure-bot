import { randomArrayElement } from "../randomArrayElement";
import { namesByKind } from "./namesByKind";

export const monsterKinds = ["Slime", "Goblin" , "Orc" , "Bandit" , "Zombie" , "Demon"] as const;
export type MonsterKind = typeof monsterKinds[number];

export const getRandomMonsterName = (kind: MonsterKind): string =>
  randomArrayElement(namesByKind.get(kind) ?? [kind]);
