import {
  createDemon,
  createDragon,
  createGoblin,
  createMonster,
  createSlime,
  createZombie,
} from '@adventure-bot/game/monster'
import { createFireling } from '@adventure-bot/game/monster/monsters/createFireling'
import { createOrc } from '@adventure-bot/game/monster/monsters/createOrc'
import { MonsterWithStats } from '@adventure-bot/game/store/selectors'
import { weightedTable } from '@adventure-bot/game/utils'

export function createRandomMonster(): MonsterWithStats {
  return createMonster(
    weightedTable([
      [10, createOrc],
      [10, createDemon],
      [10, createGoblin],
      [10, createSlime],
      [10, createZombie],
      [10, createFireling],
      [1, createDragon],
    ])()
  )
}
