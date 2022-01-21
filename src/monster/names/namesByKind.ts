import { demonNames } from '@adventure-bot/monster/names/demon'
import { dragonNames } from '@adventure-bot/monster/names/dragon'
import { MonsterKind } from '@adventure-bot/monster/names/getRandomMonsterName'
import { goblinNames } from '@adventure-bot/monster/names/goblin'
import { slimeNames } from '@adventure-bot/monster/names/slimeNames'
import { zombieNames } from '@adventure-bot/monster/names/zombie'

export const namesByKind = new Map<MonsterKind, string[]>([
  ['Goblin', goblinNames],
  ['Zombie', zombieNames],
  ['Demon', demonNames],
  ['Slime', slimeNames],
  ['Dragon', dragonNames],
])
