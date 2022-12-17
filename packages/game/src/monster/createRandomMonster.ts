import {
  createDemon,
  createDragon,
  createFireling,
  createGoblin,
  createMonster,
  createOrc,
  createPyromancer,
  createSlime,
  createSnowGoblin,
  createZombie,
} from '@adventure-bot/game/monster'
import { MonsterWithStats } from '@adventure-bot/game/store/selectors'
import { weightedTable } from '@adventure-bot/game/utils'

const isDecember = () => new Date().getMonth() === 11

export function createRandomMonster(): MonsterWithStats {
  return createMonster(
    weightedTable([
      [10, createDemon],
      [3, createDragon],
      [10, createFireling],
      [10, createGoblin],
      [10, createOrc],
      [5, createPyromancer],
      [10, createSlime],
      [isDecember() ? 10 : 0, createSnowGoblin],
      [10, createZombie],
    ])()
  )
}
