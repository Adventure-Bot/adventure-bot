import { createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import { Item } from "../../equipment/Item";

const adapter = createEntityAdapter<Item>({
  selectId: (item: Item) => item.id,
});

const slice = createSlice({
  name: "items",
  initialState: adapter.getInitialState(),
  reducers: {
    itemCreated: adapter.addOne,
  },
});

export const { itemCreated } = slice.actions;

export default slice.reducer;
