import { createAction, createSlice } from '@reduxjs/toolkit'
import { CommandInteraction } from 'discord.js'
import { times } from 'remeda'

import { Item, randomShopItem } from '@adventure-bot/game/equipment'
import { ReduxState } from '@adventure-bot/game/store'

const inventory: Item[] = []

export const shopRestocked = createAction('shop/restocked')
export const itemPurchased = createAction<{
  characterId: string
  item: Item
  interaction: CommandInteraction
}>('shop/itemPurchsed')
export const shopInventoryAdded = createAction<Item>('shop/inventoryAdded')

export const selectShopInventory = (state: ReduxState): Item[] =>
  state.shop.inventory

const shopSlice = createSlice({
  name: 'shop',
  initialState: {
    inventory,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(shopInventoryAdded, (state, { payload }) => {
        state.inventory.push(payload)
      })
      .addCase(shopRestocked, (state) => {
        state.inventory = times(3, randomShopItem)
      })
      .addCase(itemPurchased, (state, action) => {
        state.inventory = state.inventory.filter(
          (item) => item.id !== action.payload.item.id
        )
      })
  },
})

export default shopSlice.reducer
