import store from '@adventure-bot/store'
import { selectAllEncounters } from '@adventure-bot/store/selectors'
import { Encounter } from './Encounter'

export function getEncounters(): Encounter[] {
  return selectAllEncounters(store.getState())
}
