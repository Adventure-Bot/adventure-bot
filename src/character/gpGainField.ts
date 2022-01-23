import { EmbedFieldData } from 'discord.js'

import { Emoji } from '@adventure-bot/Emoji'

export const gpGainField = (adjust = 0): EmbedFieldData => ({
  name: `Gold Gained`,
  value: Emoji('gold') + ' +' + adjust,
})
