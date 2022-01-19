import { attacked } from "./characters";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Encounter } from "../../encounter/Encounter";
import { isMonster } from "../../monster/Monster";
import { LootResult } from "../../character/loot/loot";
import { newGame } from "../actions";

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
    encounterCreated(state, action: PayloadAction<Encounter>) {
      const encounter = action.payload;
      state.encountersById[encounter.id] = encounter;
    },

    roundFinished(state, action: PayloadAction<string>) {
      const encounter = state.encountersById[action.payload];
      encounter.rounds++;
    },

    playerVictory(
      state,
      action: PayloadAction<{ encounterId: string; lootResult?: LootResult }>
    ) {
      const { encounterId, lootResult } = action.payload;
      const encounter = state.encountersById[encounterId];
      if (!encounter) return;
      encounter.outcome = "player victory";
      encounter.lootResult = lootResult;
    },

    playerFled(state, action: PayloadAction<{ encounterId: string }>) {
      const { encounterId } = action.payload;
      const encounter = state.encountersById[encounterId];
      if (encounter) {
        encounter.outcome = "player fled";
      }
    },

    playerDefeat(
      state,
      action: PayloadAction<{ encounterId: string; lootResult?: LootResult }>
    ) {
      const { encounterId, lootResult } = action.payload;
      const encounter = state.encountersById[encounterId];
      if (!encounter) return;
      encounter.outcome = "player defeated";
      encounter.lootResult = lootResult;
    },

    doubleKO(state, action: PayloadAction<{ encounterId: string }>) {
      const { encounterId } = action.payload;
      const encounter = state.encountersById[encounterId];
      if (!encounter) return;
      encounter.outcome = "double ko";
    },

    clearAllEncounters(state) {
      state.encountersById = {};
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(newGame, (state) => {
        state.encountersById = {};
        state.encounterWeights = defaultEncounterWeights;
      })
      .addCase(attacked, (state, action) => {
        const { attackResult, encounter } = action.payload;
        if (!encounter) return;
        if (isMonster(attackResult.attacker)) {
          state.encountersById[encounter.id].monsterAttacks.push(attackResult);
        } else {
          state.encountersById[encounter.id].playerAttacks.push(attackResult);
        }
      });
  },
});

export const {
  encounterCreated,
  playerFled,
  roundFinished,
  playerVictory,
  playerDefeat,
  doubleKO,
} = encountersSlice.actions;

export default encountersSlice.reducer;
