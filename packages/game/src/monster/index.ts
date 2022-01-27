import { monsterEmbed } from '@adventure-bot/game/encounters'
import { Monster, isMonster } from '@adventure-bot/game/monster/Monster'
import { createMonster } from '@adventure-bot/game/monster/createMonster'
import { createRandomMonster } from '@adventure-bot/game/monster/createRandomMonster'
import { getMonster } from '@adventure-bot/game/monster/getMonster'
import { getRandomMonster } from '@adventure-bot/game/monster/getRandomMonster'
import { getRoamingMonsters } from '@adventure-bot/game/monster/getRoamingMonsters'
import {
  createDemon,
  createDragon,
  createGoblin,
  createSlime,
  createZombie,
} from '@adventure-bot/game/monster/monsters'
import {
  MonsterKind,
  getRandomMonsterName,
} from '@adventure-bot/game/monster/names/getRandomMonsterName'
import { namesByKind } from '@adventure-bot/game/monster/names/namesByKind'

export {
  MonsterKind,
  namesByKind,
  Monster,
  isMonster,
  createDemon,
  createDragon,
  createGoblin,
  createSlime,
  createZombie,
  createRandomMonster,
  getRoamingMonsters,
  createMonster,
  getRandomMonsterName,
  getRandomMonster,
  getMonster,
  monsterEmbed,
}
