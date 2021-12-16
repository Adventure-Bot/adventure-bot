import store from "../store";
import { purgeExpiredStatuses as doPurgeExpiredStatuses } from "../store/slices/characters";
import { selectCharacterById } from "../store/selectors";

export const purgeExpiredStatuses = (characterId: string): void => {
  const character = selectCharacterById(store.getState(), characterId);
  if (!character) return;
  store.dispatch(doPurgeExpiredStatuses(character));
  console.log(`${characterId} status effects purged`);
};
