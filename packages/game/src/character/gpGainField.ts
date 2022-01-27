import { EmbedFieldData } from 'discord.js'

import { EmojiModifier } from '@adventure-bot/Emoji'

export const gpGainField = (adjust = 0): EmbedFieldData => ({
  name: `Gold Gained`,
  value: EmojiModifier('gold', adjust),
})
