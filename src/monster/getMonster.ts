import { Monster } from '@adventure-bot/monster/Monster'
import store from '@adventure-bot/store'
import { selectMonsterById } from '@adventure-bot/store/selectors'

export const getMonster = (id: string): Monster | void => {
  return selectMonsterById(store.getState(), id)
}
