import { EmbedField } from 'discord.js'

import { Quest, questProgressBar } from '@adventure-bot/game/quest'

export const questProgressField = (
  quest: Quest,
  amount?: number
): EmbedField => ({
  name: `${quest.title} ${amount ? `(+${amount})` : ''}`,
  value: `${questProgressBar(quest)} ${quest.progress}/${quest.totalRequired}`,
  inline: true,
})
