import store from '../store'
import { selectRoamingMonsters as doGetRoamingMonsters } from '../store/selectors'
import { Monster } from './Monster'

export function getRoamingMonsters(): Monster[] {
  return doGetRoamingMonsters(store.getState())
}
