import { Monster } from '@adventure-bot/monster'
import {
  createDemon,
  createDragon,
  createGoblin,
  createSlime,
  createZombie,
} from '@adventure-bot/monster'
import { weightedTable } from '@adventure-bot/utils'

export function createRandomMonster(): Monster {
  return weightedTable([
    [10, createDemon],
    [10, createGoblin],
    [10, createSlime],
    [10, createZombie],
    [0.5, createDragon],
  ])()
}
