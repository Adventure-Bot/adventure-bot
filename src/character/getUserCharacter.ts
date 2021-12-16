import { User } from "discord.js";
import { Character } from "./Character";
import { createCharacter } from "./createCharacter";

import { purgeExpiredStatuses } from "../statusEffects/purgeExpiredStatuses";

import store from "../store";
import { selectCharacterById } from "../store/selectors";

export const getUserCharacter = (user: User): Character => {
  purgeExpiredStatuses(user.id);
  const character = selectCharacterById(store.getState(), user.id);
  if (!character) {
    return createCharacter({
      id: user.id,
      name: user.username,
      profile: user.avatarURL() ?? undefined,
    });
  }
  return character;
};
