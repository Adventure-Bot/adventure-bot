import { Monster } from '@adventure-bot/monster/Monster'
import store from '@adventure-bot/store'
import { selectRoamingMonsters as doGetRoamingMonsters } from '@adventure-bot/store/selectors'

export function getRoamingMonsters(): Monster[] {
  return doGetRoamingMonsters(store.getState())
}
