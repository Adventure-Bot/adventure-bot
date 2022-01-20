import { createSlice } from "@reduxjs/toolkit";
import { heavyCrownId } from "../../equipment/items/heavyCrown";
import { itemReceived, newGame, tick } from "../actions";

const crownDefaultState = {
  bearerId: "",
  claimedAt: 0,
  sovereign: false,
};

const crownSlice = createSlice({
  name: "crown",
  initialState: crownDefaultState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(itemReceived, (state, action) => {
        if (action.payload.item.id == heavyCrownId) {
          state.bearerId = action.payload.characterId;
          state.claimedAt = Date.now();
        }
      })
      .addCase(tick, (state) => {
        if (
          !state.sovereign &&
          state.claimedAt > 0 &&
          Date.now() - state.claimedAt > 1000 * 60 * 60 * 24
        ) {
          state.sovereign = true;
        }
      })
      .addCase(newGame, (state) => {
        Object.assign(state, crownDefaultState);
      });
  },
});

export default crownSlice.reducer;
