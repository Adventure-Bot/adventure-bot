import { randomUUID } from 'crypto'

import { defaultCharacter } from '@adventure-bot/game/character'
import { Monster, MonsterKind } from '@adventure-bot/game/monster'
import store from '@adventure-bot/game/store'
import {
  MonsterWithStats,
  selectCharacterStats,
} from '@adventure-bot/game/store/selectors'
import { monsterCreated } from '@adventure-bot/game/store/slices/characters'

export const createMonster = (
  monster: Partial<Monster> & { name: string; kind: MonsterKind }
): MonsterWithStats => {
  const newMonster: Monster = {
    ...defaultCharacter,
    id: monster?.id ?? randomUUID(),
    ...monster,
    isMonster: true,
  }
  const monsterWithStats: MonsterWithStats = {
    ...newMonster,
    stats: selectCharacterStats(store.getState(), newMonster),
    statsModified: selectCharacterStats(store.getState(), newMonster, true),
  }
  store.dispatch(monsterCreated(monsterWithStats))
  console.log(`created monster ${newMonster.id}`)
  return monsterWithStats
}
