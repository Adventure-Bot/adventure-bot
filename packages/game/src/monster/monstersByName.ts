import {
  createDemon,
  createDragon,
  createGoblin,
  createOrc,
  createRandomMonster,
  createSlime,
  createZombie,
} from '@adventure-bot/game/monster'
import { createGiantCrab, createShark } from '@adventure-bot/game/monster'
import { createFireling } from '@adventure-bot/game/monster/monsters/createFireling'

export const monstersByName = [
  ['Demon', createDemon],
  ['Dragon', createDragon],
  ['Fireling', createFireling],
  ['Giant Crab', createGiantCrab],
  ['Goblin', createGoblin],
  ['Orc', createOrc],
  ['Random', createRandomMonster],
  ['Shark', createShark],
  ['Slime', createSlime],
  ['Zombie', createZombie],
] as const
