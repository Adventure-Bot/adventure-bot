import { randomArrayElement } from "../randomArrayElement";
import { namesByKind } from "./namesByKind";

export const monsterKinds = ["goblin", "orc", "bandit", "slime"] as const;

export type MonsterKind = typeof monsterKinds[number];

export const getRandomMonsterName = (kind: MonsterKind): string =>
  randomArrayElement(namesByKind.get(kind) ?? [kind]);
