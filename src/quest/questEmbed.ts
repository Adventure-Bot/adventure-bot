import { MessageEmbed } from 'discord.js'
import { Character } from '@adventure-bot/character/Character'
import { questProgressField } from '@adventure-bot/quest/questProgressField'

export const questEmbed = (character: Character): MessageEmbed | void => {
  if (Object.keys(character.quests).length === 0) return
  const embed = new MessageEmbed()
  embed.setTitle('Quests')
  Object.values(character.quests).forEach((quest) => {
    embed.addFields([questProgressField(quest)])
  })
  return embed
}
