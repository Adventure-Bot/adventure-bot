import store from "../store";
import { Character } from "../character/Character";
import { selectCharacterById } from "../store/selectors";
import { itemReceived } from "../store/slices/characters";
import { Item } from "./Item";

/**
 * @deprecated prefer calling store.dispatch(itemAddedToInventory(...)) directly
 * @param character
 * @param item
 * @returns
 */
export const grantCharacterItem = (
  character: Character,
  item: Item
): Character | void => {
  store.dispatch(
    itemReceived({
      characterId: character.id,
      item,
    })
  );
  return selectCharacterById(store.getState(), character.id);
};
