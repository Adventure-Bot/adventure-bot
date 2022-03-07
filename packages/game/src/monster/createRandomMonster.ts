import {
  Monster,
  createDemon,
  createDragon,
  createGoblin,
  createSlime,
  createZombie,
} from '@adventure-bot/game/monster'
import { weightedTable } from '@adventure-bot/game/utils'

export function createRandomMonster(): Monster {
  return weightedTable([
    [10, createDemon],
    [10, createGoblin],
    [10, createSlime],
    [10, createZombie],
    [1, createDragon],
  ])()
}
