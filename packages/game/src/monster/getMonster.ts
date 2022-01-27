import { Monster } from '@adventure-bot/game/monster'
import store from '@adventure-bot/game/store'
import { selectMonsterById } from '@adventure-bot/game/store/selectors'

export const getMonster = (id: string): Monster | void => {
  return selectMonsterById(store.getState(), id)
}
