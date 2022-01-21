import store from '@adventure-bot/store'
import { selectAllEncounters } from '@adventure-bot/store/selectors'
import { Encounter } from '@adventure-bot/encounter/Encounter'

export function getEncounters(): Encounter[] {
  return selectAllEncounters(store.getState())
}
