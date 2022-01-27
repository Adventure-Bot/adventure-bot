import { LootResult } from '@adventure-bot/game/character'
import store from '@adventure-bot/game/store'
import { selectLoot } from '@adventure-bot/game/store/selectors'

export function getLoots(): LootResult[] {
  const state = store.getState()
  return selectLoot(state)
}
