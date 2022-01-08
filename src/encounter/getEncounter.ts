import { Encounter } from "./Encounter";
import { selectEncounterById } from "../store/selectors";
import store from "../store";

export function getEncounter(encounterId: string): Encounter | void {
  return selectEncounterById(store.getState(), encounterId);
}
