import { namesByKind } from '@adventure-bot/game/monster'
import { randomArrayElement } from '@adventure-bot/game/utils'

const monsterKinds = [
  'Beholder',
  'Demon',
  'Dragon',
  'Fireling',
  'Giant Crab',
  'Goblin',
  'Orc',
  'Pyromancer',
  'Shark',
  'Slime',
  'Snow Goblin',
  'Tabaxi',
  'Zombie',
] as const
export type MonsterKind = typeof monsterKinds[number]

export const getRandomMonsterName = (kind: MonsterKind): string =>
  randomArrayElement(namesByKind.get(kind) ?? [kind])
