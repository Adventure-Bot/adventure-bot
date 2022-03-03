import { createAction } from '@reduxjs/toolkit'
import { CommandInteraction } from 'discord.js'

import { Character } from '@adventure-bot/game/character'
import { Item } from '@adventure-bot/game/equipment/Item'

export const newGame = createAction('newGame')
export const tick = createAction('tick')
export const commandUsed = createAction<CommandInteraction>('commandUsed')
export const winnerDeclared =
  createAction<{ winner: Character }>('winnerDeclared')
export const itemReceived = createAction<{
  characterId: string
  item: Item
}>('itemReceived')
export const backdateCrown = createAction('backdateCrown') // for testing
export const characterListCreated = createAction<{ threadId: string }>(
  'characterListCreated'
)
