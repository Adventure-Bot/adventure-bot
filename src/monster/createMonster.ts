import { randomUUID } from 'crypto'
import { defaultCharacter } from '@adventure-bot/character/defaultCharacter'
import { Monster } from '@adventure-bot/monster/Monster'
import store from '@adventure-bot/store'
import { monsterCreated } from '@adventure-bot/store/slices/characters'
import { selectMonsterById } from '@adventure-bot/store/selectors'
import { MonsterKind } from '@adventure-bot/monster/names/getRandomMonsterName'

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
