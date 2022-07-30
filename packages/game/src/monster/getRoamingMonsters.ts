import store from '@adventure-bot/game/store'
import {
  MonsterWithStats,
  selectRoamingMonsters,
} from '@adventure-bot/game/store/selectors'

export function getRoamingMonsters(): MonsterWithStats[] {
  return selectRoamingMonsters(store.getState())
}
