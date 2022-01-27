import { Encounter } from '@adventure-bot/game/encounters'
import store from '@adventure-bot/game/store'
import { selectAllEncounters } from '@adventure-bot/game/store/selectors'

export function getEncounters(): Encounter[] {
  return selectAllEncounters(store.getState())
}
