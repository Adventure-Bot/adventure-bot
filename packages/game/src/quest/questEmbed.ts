import { MessageEmbed } from 'discord.js'

import { Quest } from '@adventure-bot/game/quest'
import { progressBar } from '@adventure-bot/game/utils'

export function questEmbed(quest: Quest): MessageEmbed {
  const embed = new MessageEmbed({
    title: quest.title,
    description: quest.objective,
  })
  embed.addField('Reward', quest.reward)
  embed.addField(
    'Progress',
    `${progressBar(quest.progress / quest.totalRequired)} ${quest.progress}/${
      quest.totalRequired
    }`
  )
  return embed
}
