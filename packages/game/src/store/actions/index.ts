import { createAction } from '@reduxjs/toolkit'
import { CommandInteraction, Message, ThreadChannel } from 'discord.js'

import { Character } from '@adventure-bot/game/character'
import { Item } from '@adventure-bot/game/equipment/Item'
import { TrapAttackResult } from '@adventure-bot/game/trap'

export const newGame = createAction('newGame')
export const commandUsed = createAction<CommandInteraction>('commandUsed')
export const winnerDeclared =
  createAction<{ winner: Character; interaction?: CommandInteraction }>(
    'winnerDeclared'
  )
export const winnerRevoked = createAction('winnerRevoked')
export const itemReceived = createAction<{
  characterId: string
  item: Item
  interaction: CommandInteraction
}>('itemReceived')
export const backdateCrown = createAction('backdateCrown') // for testing
export const characterListThreadCreated = createAction<ThreadChannel>(
  'characterListThreadCreated'
)

export const trapAttacked = createAction<TrapAttackResult>('trapAttacked')

export const characterMessageCreated = createAction<{
  character: Character
  message: Message
}>('characterMessageCreated')
