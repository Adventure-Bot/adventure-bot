import { randomArrayElement } from '../randomArrayElement'
import { namesByKind } from './namesByKind'

const monsterKinds = ['Slime', 'Goblin', 'Zombie', 'Demon', 'Dragon'] as const
export type MonsterKind = typeof monsterKinds[number]

export const getRandomMonsterName = (kind: MonsterKind): string =>
  randomArrayElement(namesByKind.get(kind) ?? [kind])
