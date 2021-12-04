import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { randomUUID } from "crypto";

import { Encounter } from "../../monster/Encounter";
import { Monster } from "../../monster/Monster";
import { Character } from "../../character/Character";
import { AttackResult } from "../../attack/AttackResult";

const encountersById: Record<string, Encounter> = {};

export const defaultEncounterWeights = {
  divineBlessing: 0.1,
  angels: 0.6,
  fairyWell: 1,
  shop: 1,
  tavern: 1,
  trap: 1,
  travel: 1,
  monster: 2,
  chest: 2,
  randomShrine: 2,
};

const encountersSlice = createSlice({
  name: "encounters",
  initialState: {
    encountersById,
    encounterWeights: defaultEncounterWeights,
  },
  reducers: {
    createEncounter(
      state,
      action: PayloadAction<{
        player: Character;
        monster: Monster;
      }>
    ) {
      const { monster, player } = action.payload;
      const encounter: Encounter = {
        id: randomUUID(),
        characterId: player.id,
        monsterId: monster.id,
        date: new Date().toString(),
        playerAttacks: [],
        monsterAttacks: [],
        rounds: 1,
        goldLooted: 0,
        outcome: "in progress",
      };
      state.encountersById[encounter.id] = {
        ...encounter,
      };
    },
    updateEncounter(state, action: PayloadAction<Encounter>) {
      const encounter = action.payload;
      state.encountersById[encounter.id] = {
        ...encounter,
      };
    },
    addPlayerAttack(
      state,
      action: PayloadAction<{
        encounter: Encounter;
        result: AttackResult;
      }>
    ) {
      const { encounter, result } = action.payload;
      state.encountersById[encounter.id].playerAttacks.push(result);
    },
    addMonsterAttack(
      state,
      action: PayloadAction<{
        encounter: Encounter;
        result: AttackResult;
      }>
    ) {
      const { encounter, result } = action.payload;
      state.encountersById[encounter.id].monsterAttacks.push(result);
    },
  },
});

export const {
  createEncounter,
  updateEncounter,
  addPlayerAttack,
  addMonsterAttack,
} = encountersSlice.actions;

export default encountersSlice.reducer;
