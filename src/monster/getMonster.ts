import { Monster } from './Monster'
import store from '../store'
import { selectMonsterById } from '../store/selectors'

export const getMonster = (id: string): Monster | void => {
  return selectMonsterById(store.getState(), id)
}
