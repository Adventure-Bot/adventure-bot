import { beholderNames } from '@adventure-bot/game/monster/names/beholderNames'
import { demonNames } from '@adventure-bot/game/monster/names/demon'
import { dragonNames } from '@adventure-bot/game/monster/names/dragon'
import { earthElementalNames } from '@adventure-bot/game/monster/names/earthElemental'
import { firelingNames } from '@adventure-bot/game/monster/names/fireling'
import { MonsterKind } from '@adventure-bot/game/monster/names/getRandomMonsterName'
import { giantCrabNames } from '@adventure-bot/game/monster/names/giantCrab'
import { goblinNames } from '@adventure-bot/game/monster/names/goblin'
import { orcNames } from '@adventure-bot/game/monster/names/orc'
import { pyromancerNames } from '@adventure-bot/game/monster/names/pyromancer'
import { sharkNames } from '@adventure-bot/game/monster/names/shark'
import { slimeNames } from '@adventure-bot/game/monster/names/slimeNames'
import { tabaxiNames } from '@adventure-bot/game/monster/names/tabaxi'
import { zombieNames } from '@adventure-bot/game/monster/names/zombie'

export const namesByKind = new Map<MonsterKind, string[]>([
  ['Beholder', beholderNames],
  ['Demon', demonNames],
  ['Dragon', dragonNames],
  ['Earth Elemental', earthElementalNames],
  ['Fireling', firelingNames],
  ['Giant Crab', giantCrabNames],
  ['Goblin', goblinNames],
  ['Orc', orcNames],
  ['Pyromancer', pyromancerNames],
  ['Shark', sharkNames],
  ['Slime', slimeNames],
  ['Snow Goblin', goblinNames],
  ['Tabaxi', tabaxiNames],
  ['Zombie', zombieNames],
])
