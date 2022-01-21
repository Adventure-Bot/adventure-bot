import { LootResult } from '../character/loot/loot'
import store from '@adventure-bot/store'
import { selectLoot } from '@adventure-bot/store/selectors'

export function getLoots(): LootResult[] {
  const state = store.getState()
  return selectLoot(state)
}
