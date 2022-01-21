import { Monster } from '@adventure-bot/monster/Monster'
import { weightedTable } from '@adventure-bot/utils'
import {
  createDemon,
  createGoblin,
  createSlime,
  createZombie,
  createDragon,
} from '@adventure-bot/monster/monsters'

export function createRandomMonster(): Monster {
  return weightedTable([
    [10, createDemon],
    [10, createGoblin],
    [10, createSlime],
    [10, createZombie],
    [0.5, createDragon],
  ])()
}
