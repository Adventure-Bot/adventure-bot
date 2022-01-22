import { Monster, isMonster } from '@adventure-bot/monster/Monster'
import { createMonster } from '@adventure-bot/monster/createMonster'
import { createRandomMonster } from '@adventure-bot/monster/createRandomMonster'
import { getMonster } from '@adventure-bot/monster/getMonster'
import { getRandomMonster } from '@adventure-bot/monster/getRandomMonster'
import { getRoamingMonsters } from '@adventure-bot/monster/getRoamingMonsters'
import {
  createDemon,
  createDragon,
  createGoblin,
  createSlime,
  createZombie,
} from '@adventure-bot/monster/monsters'
import {
  MonsterKind,
  getRandomMonsterName,
} from '@adventure-bot/monster/names/getRandomMonsterName'
import { namesByKind } from '@adventure-bot/monster/names/namesByKind'

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
}
