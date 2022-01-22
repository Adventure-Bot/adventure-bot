import { LootResult } from '@adventure-bot/character'
import store from '@adventure-bot/store'
import { selectLoot } from '@adventure-bot/store/selectors'

export function getLoots(): LootResult[] {
  const state = store.getState()
  return selectLoot(state)
}
