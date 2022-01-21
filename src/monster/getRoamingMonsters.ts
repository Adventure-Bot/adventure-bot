import store from '@adventure-bot/store'
import { selectRoamingMonsters as doGetRoamingMonsters } from '@adventure-bot/store/selectors'
import { Monster } from './Monster'

export function getRoamingMonsters(): Monster[] {
  return doGetRoamingMonsters(store.getState())
}
