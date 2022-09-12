import { demonNames } from '@adventure-bot/game/monster/names/demon'
import { dragonNames } from '@adventure-bot/game/monster/names/dragon'
import { firelingNames } from '@adventure-bot/game/monster/names/fireling'
import { MonsterKind } from '@adventure-bot/game/monster/names/getRandomMonsterName'
import { giantCrabNames } from '@adventure-bot/game/monster/names/giantCrab'
import { goblinNames } from '@adventure-bot/game/monster/names/goblin'
import { orcNames } from '@adventure-bot/game/monster/names/orc'
import { sharkNames } from '@adventure-bot/game/monster/names/shark'
import { slimeNames } from '@adventure-bot/game/monster/names/slimeNames'
import { zombieNames } from '@adventure-bot/game/monster/names/zombie'

export const namesByKind = new Map<MonsterKind, string[]>([
  ['Demon', demonNames],
  ['Dragon', dragonNames],
  ['Fireling', firelingNames],
  ['Giant Crab', giantCrabNames],
  ['Goblin', goblinNames],
  ['Orc', orcNames],
  ['Shark', sharkNames],
  ['Slime', slimeNames],
  ['Zombie', zombieNames],
])
