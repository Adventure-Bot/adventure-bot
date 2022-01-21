import { EmbedFieldData, Interaction } from 'discord.js'

import { Emoji } from '@adventure-bot/Emoji'

export const gpGainField = (i: Interaction, adjust = 0): EmbedFieldData => ({
  name: `Gold Gained`,
  value: Emoji(i, 'gold') + ' +' + adjust,
})
