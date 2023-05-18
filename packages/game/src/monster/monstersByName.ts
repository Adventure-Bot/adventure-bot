import {
  createDemon,
  createDragon,
  createFireling,
  createGiantCrab,
  createGoblin,
  createOrc,
  createRandomMonster,
  createShark,
  createSlime,
  createSnowGoblin,
  createTabaxi,
  createZombie,
} from '@adventure-bot/game/monster'
import { createPyromancer } from '@adventure-bot/game/monster/monsters/createPyromancer'

export const monstersByName = [
  ['Demon', createDemon],
  ['Dragon', createDragon],
  ['Fireling', createFireling],
  ['Giant Crab', createGiantCrab],
  ['Goblin', createGoblin],
  ['Orc', createOrc],
  ['Pyromancer', createPyromancer],
  ['Random', createRandomMonster],
  ['Shark', createShark],
  ['Slime', createSlime],
  ['Snow Goblin', createSnowGoblin],
  ['Tabaxi', createTabaxi],
  ['Zombie', createZombie],
] as const
