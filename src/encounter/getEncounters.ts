import store from '../store'
import { selectAllEncounters } from '../store/selectors'

export function getEncounters() {
  return selectAllEncounters(store.getState())
}
