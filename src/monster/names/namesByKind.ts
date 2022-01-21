import { MonsterKind } from '@adventure-bot/monster/names/getRandomMonsterName'
import { goblinNames } from '@adventure-bot/monster/names/goblin'
import { zombieNames } from '@adventure-bot/monster/names/zombie'
import { demonNames } from '@adventure-bot/monster/names/demon'
import { slimeNames } from '@adventure-bot/monster/names/slimeNames'
import { dragonNames } from '@adventure-bot/monster/names/dragon'

export const namesByKind = new Map<MonsterKind, string[]>([
  ['Goblin', goblinNames],
  ['Zombie', zombieNames],
  ['Demon', demonNames],
  ['Slime', slimeNames],
  ['Dragon', dragonNames],
])
