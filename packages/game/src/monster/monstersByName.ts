import {
  createDemon,
  createDragon,
  createGoblin,
  createRandomMonster,
  createSlime,
  createZombie,
} from '@adventure-bot/game/monster'
import { createGiantCrab, createShark } from '@adventure-bot/game/monster'

export const monstersByName = [
  ['Giant Crab', createGiantCrab],
  ['Shark', createShark],
  ['Goblin', createGoblin],
  ['Demon', createDemon],
  ['Slime', createSlime],
  ['Zombie', createZombie],
  ['Dragon', createDragon],
  ['Random', createRandomMonster],
] as const
