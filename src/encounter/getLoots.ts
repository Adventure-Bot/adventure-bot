import { LootResult } from '../character/loot/loot'
import store from '../store'
import { selectLoot } from '../store/selectors'

export function getLoots(): LootResult[] {
  const state = store.getState()
  return selectLoot(state)
}
