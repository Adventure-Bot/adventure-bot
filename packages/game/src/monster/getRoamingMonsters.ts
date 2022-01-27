import { Monster } from '@adventure-bot/monster'
import store from '@adventure-bot/store'
import { selectRoamingMonsters as doGetRoamingMonsters } from '@adventure-bot/store/selectors'

export function getRoamingMonsters(): Monster[] {
  return doGetRoamingMonsters(store.getState())
}
