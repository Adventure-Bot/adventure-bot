import store from "../store";
import { Character } from "../character/Character";
import { selectCharacterById } from "../store/selectors";
import { addItemToInventory } from "../store/slices/characters";
import { Item } from "./Item";

export const grantCharacterItem = (
  character: Character,
  item: Item
): Character | void => {
  store.dispatch(
    addItemToInventory({
      character,
      item,
    })
  );
  return selectCharacterById(store.getState(), character.id);
};
