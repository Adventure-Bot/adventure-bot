import { EmbedBuilder } from 'discord.js'

import { Quest } from '@adventure-bot/game/quest'
import { progressBar } from '@adventure-bot/game/utils'

export function questEmbed(quest: Quest): EmbedBuilder {
  return new EmbedBuilder({
    title: quest.title,
    description: quest.objective,
    fields: [
      { name: 'Reward', value: quest.reward },
      {
        name: 'Progress',
        value: `${progressBar(quest.progress / quest.totalRequired)} ${
          quest.progress
        }/${quest.totalRequired}`,
      },
    ],
  })
}
