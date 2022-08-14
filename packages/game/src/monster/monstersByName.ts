import {
  createDemon,
  createDragon,
  createGoblin,
  createRandomMonster,
  createSlime,
  createZombie,
} from '@adventure-bot/game/monster'
import { createGiantCrab, createShark } from '@adventure-bot/game/monster'
import { createFireling } from '@adventure-bot/game/monster/monsters/createFireling'

export const monstersByName = [
  ['Giant Crab', createGiantCrab],
  ['Shark', createShark],
  ['Goblin', createGoblin],
  ['Demon', createDemon],
  ['Slime', createSlime],
  ['Zombie', createZombie],
  ['Dragon', createDragon],
  ['Fireling', createFireling],
  ['Random', createRandomMonster],
] as const
