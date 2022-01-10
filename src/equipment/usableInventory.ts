import { isUsable, Usable } from "./equipment";
import { Character } from "../character/Character";

export function usableInventory(character: Character): Usable[] {
  return character.inventory.filter(isUsable);
}
