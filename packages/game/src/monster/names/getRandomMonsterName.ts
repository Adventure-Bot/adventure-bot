import { namesByKind } from '@adventure-bot/game/monster'
import { randomArrayElement } from '@adventure-bot/game/utils'

const monsterKinds = [
  'Slime',
  'Goblin',
  'Snow Goblin',
  'Zombie',
  'Demon',
  'Dragon',
  'Shark',
  'Giant Crab',
  'Fireling',
  'Orc',
] as const
export type MonsterKind = typeof monsterKinds[number]

export const getRandomMonsterName = (kind: MonsterKind): string =>
  randomArrayElement(namesByKind.get(kind) ?? [kind])
