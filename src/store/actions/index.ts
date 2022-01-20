import { createAction } from "@reduxjs/toolkit";
import { Item } from "../../equipment/Item";

export const newGame = createAction("new_game");
export const tick = createAction("tick");
export const channelInteraction = createAction<string>("channelInteraction");
export const itemReceived = createAction<{
  characterId: string;
  item: Item;
}>("itemReceived");
