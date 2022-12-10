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
  createZombie,
} from '@adventure-bot/game/monster'

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
  ['Snow Goblin', createSnowGoblin],
  ['Zombie', createZombie],
] as const
