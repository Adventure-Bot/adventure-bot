import { createAction } from '@reduxjs/toolkit'
import { CommandInteraction } from 'discord.js'
import { Character } from '../../character/Character'
import { Item } from '../../equipment/Item'

export const newGame = createAction('new_game')
export const tick = createAction('tick')
export const commandInteraction =
  createAction<CommandInteraction>('commandInteraction')
export const winnerDeclared =
  createAction<{ winner: Character }>('winnerDeclared')
export const itemReceived = createAction<{
  characterId: string
  item: Item
}>('itemReceived')
