import { EmbedFieldData } from 'discord.js'

import { Emoji } from '@adventure-bot/Emoji'

export const xpGainField = (adjust = 0): EmbedFieldData => ({
  name: `Experience Gained`,
  value: Emoji('xp') + ' +' + adjust,
})
