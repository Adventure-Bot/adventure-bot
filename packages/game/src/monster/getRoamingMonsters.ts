import { Monster } from '@adventure-bot/game/monster'
import store from '@adventure-bot/game/store'
import { selectRoamingMonsters as doGetRoamingMonsters } from '@adventure-bot/game/store/selectors'

export function getRoamingMonsters(): Monster[] {
  return doGetRoamingMonsters(store.getState())
}
