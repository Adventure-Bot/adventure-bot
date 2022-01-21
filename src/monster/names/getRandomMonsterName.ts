import { namesByKind } from '@adventure-bot/monster/names/namesByKind'
import { randomArrayElement } from '@adventure-bot/monster/randomArrayElement'

const monsterKinds = ['Slime', 'Goblin', 'Zombie', 'Demon', 'Dragon'] as const
export type MonsterKind = typeof monsterKinds[number]

export const getRandomMonsterName = (kind: MonsterKind): string =>
  randomArrayElement(namesByKind.get(kind) ?? [kind])
