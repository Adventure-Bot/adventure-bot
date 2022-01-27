import { EmbedField } from 'discord.js'

import { Quest, questProgressBar } from '@adventure-bot/quest'

export const questProgressField = (quest: Quest): EmbedField => ({
  name: quest.title,
  value: `${questProgressBar(quest)} ${quest.progress}/${quest.totalRequired}`,
  inline: true,
})
