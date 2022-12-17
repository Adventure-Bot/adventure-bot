import { namesByKind } from '@adventure-bot/game/monster'
import { randomArrayElement } from '@adventure-bot/game/utils'

const monsterKinds = [
  'Demon',
  'Dragon',
  'Fireling',
  'Giant Crab',
  'Goblin',
  'Goblin',
  'Orc',
  'Pyromancer',
  'Shark',
  'Slime',
  'Slime',
  'Snow Goblin',
  'Zombie',
  'Zombie',
] as const
export type MonsterKind = typeof monsterKinds[number]

export const getRandomMonsterName = (kind: MonsterKind): string =>
  randomArrayElement(namesByKind.get(kind) ?? [kind])
