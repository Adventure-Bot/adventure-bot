import { demonNames } from '@adventure-bot/game/monster/names/demon'
import { dragonNames } from '@adventure-bot/game/monster/names/dragon'
import { MonsterKind } from '@adventure-bot/game/monster/names/getRandomMonsterName'
import { goblinNames } from '@adventure-bot/game/monster/names/goblin'
import { slimeNames } from '@adventure-bot/game/monster/names/slimeNames'
import { zombieNames } from '@adventure-bot/game/monster/names/zombie'

export const namesByKind = new Map<MonsterKind, string[]>([
  ['Goblin', goblinNames],
  ['Zombie', zombieNames],
  ['Demon', demonNames],
  ['Slime', slimeNames],
  ['Dragon', dragonNames],
])
