import { Monster } from '@adventure-bot/game/monster'
import store from '@adventure-bot/game/store'
import { selectRoamingMonsters } from '@adventure-bot/game/store/selectors'

export function getRoamingMonsters(): Monster[] {
  return selectRoamingMonsters(store.getState())
}
