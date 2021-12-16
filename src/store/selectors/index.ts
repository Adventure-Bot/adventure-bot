import { createSelector } from "@reduxjs/toolkit";
import { Character } from "../../character/Character";
import { isMonster } from "../../monster/Monster";
import { ReduxState } from "../../store";
import { getAsset } from "../../utils/getAsset";

const decorateCharacterWithAssetProfile = <T extends Character>(
  character: T
) => {
  if (character && character.asset) {
    return {
      ...character,
      profile: getAsset(
        // @ts-ignore
        character.asset[0],
        character.asset[1],
        character.asset[2],
        character.id
      ).s3Url(),
    };
  } else return character;
};

export const selectCharacterById = createSelector(
  (state: ReduxState, id: string) => state.characters.charactersById[id],
  (character) => decorateCharacterWithAssetProfile(character)
);

export const selectAllCharacters = createSelector(
  (state: ReduxState) => state.characters.charactersById,
  (charactersById) =>
    Object.values(charactersById)
      .filter((character) => character.isMonster !== true)
      .map((c) => decorateCharacterWithAssetProfile<Character>(c))
);

export const selectMonsterById = createSelector(
  (state: ReduxState, id: string) => state.characters.charactersById[id],
  (character) =>
    isMonster(character)
      ? decorateCharacterWithAssetProfile(character)
      : undefined
);

export const selectRoamingMonsters = createSelector(
  (state: ReduxState) =>
    state.characters.roamingMonsters.map(
      (id) => state.characters.charactersById[id]
    ),
  (monsters) => monsters.filter(isMonster).filter((monster) => monster.hp > 0)
);

export const selectAllEncounters = createSelector(
  (state: ReduxState) => state.encounters.encountersById,
  (encountersById) => Object.values(encountersById)
);

export const selectEncounterById = createSelector(
  (state: ReduxState, id: string) => state.encounters.encountersById[id],
  (encounter) => encounter
);

export const selectCooldownByType = createSelector(
  (state: ReduxState, cooldownType: keyof ReduxState["cooldowns"]) =>
    state.cooldowns[cooldownType],
  (cooldown) => cooldown
);

export const selectHasItemNameInInventory = createSelector(
  (state: ReduxState, character: Character, itemName: string) =>
    state.characters.charactersById[character.id]?.inventory.some(
      (item) => item.name === itemName
    ),
  (hasItem) => hasItem
);

export const selectLoot = createSelector(
  (state: ReduxState) => state.loots.lootsById,
  (loots) => Object.values(loots)
);

export const selectIsHeavyCrownInPlay = createSelector(
  (state: ReduxState) => state.characters.isHeavyCrownInPlay,
  (isHeavyCrownInPlay) => isHeavyCrownInPlay
);
