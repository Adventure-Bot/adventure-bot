import { EmbedBuilder } from 'discord.js'

import { Character } from '@adventure-bot/game/character'
import { questProgressField } from '@adventure-bot/game/quest'

export const characterQuestSummary = (
  character: Character
): EmbedBuilder | void => {
  if (Object.keys(character.quests).length === 0) return
  const embed = new EmbedBuilder()
  embed.setTitle(`${character.name}'s Quests`)
  Object.values(character.quests).forEach((quest) => {
    embed.addFields([questProgressField(quest)])
  })
  return embed
}
