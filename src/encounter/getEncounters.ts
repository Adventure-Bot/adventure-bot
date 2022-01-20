import store from '../store'
import { selectAllEncounters } from '../store/selectors'
import { Encounter } from './Encounter'

export function getEncounters(): Encounter[] {
  return selectAllEncounters(store.getState())
}
