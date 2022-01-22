import { Encounter } from '@adventure-bot/encounter'
import store from '@adventure-bot/store'
import { selectAllEncounters } from '@adventure-bot/store/selectors'

export function getEncounters(): Encounter[] {
  return selectAllEncounters(store.getState())
}
