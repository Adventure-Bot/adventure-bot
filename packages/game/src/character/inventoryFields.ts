import { EmbedFieldData } from 'discord.js'

import { Character } from '@adventure-bot/game/character'

export const inventoryFields = (character: Character): EmbedFieldData[] =>
  character.inventory.map((item) => ({
    name: item.type,
    value: item.name,
  }))
