import {
  createBeholder,
  createDemon,
  createDragon,
  createEarthElemental,
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
  ['Beholder', createBeholder],
  ['Demon', createDemon],
  ['Dragon', createDragon],
  ['Earth Elemental', createEarthElemental],
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
