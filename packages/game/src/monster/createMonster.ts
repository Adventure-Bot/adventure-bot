import { randomUUID } from 'crypto'

import { defaultCharacter } from '@adventure-bot/game/character'
import { Monster, MonsterKind } from '@adventure-bot/game/monster'
import store from '@adventure-bot/game/store'
import { selectMonsterById } from '@adventure-bot/game/store/selectors'
import { monsterCreated } from '@adventure-bot/game/store/slices/characters'

export const createMonster = (
  monster: Partial<Monster> & { name: string; kind: MonsterKind }
): Monster => {
  const newMonster: Monster = {
    ...defaultCharacter,
    id: monster?.id ?? randomUUID(),
    ...monster,
    isMonster: true,
  }
  store.dispatch(monsterCreated(newMonster))
  console.log(`created monster ${newMonster.id}`)
  return selectMonsterById(store.getState(), newMonster.id) ?? newMonster
}
