import { EmbedField } from 'discord.js'
import { Quest } from '@adventure-bot/quest/Quest'
import { questProgressBar } from '@adventure-bot/quest/questProgressBar'

export const questProgressField = (quest: Quest): EmbedField => ({
  name: quest.title,
  value: `${questProgressBar(quest)} ${quest.progress}/${quest.totalRequired}`,
  inline: true,
})
