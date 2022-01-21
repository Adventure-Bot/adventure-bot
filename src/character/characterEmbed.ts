import { CommandInteraction, MessageEmbed } from 'discord.js'
import { Character } from '@adventure-bot/character/Character'
import { primaryStatFields } from '@adventure-bot/character/primaryStatFields'
import { decoratedName } from '@adventure-bot/character/decoratedName'

export function characterEmbed({
  character,
  interaction,
}: {
  character: Character
  interaction: CommandInteraction
}): MessageEmbed {
  return new MessageEmbed()
    .setTitle(decoratedName(character))
    .setImage(character.profile)
    .addFields([
      ...primaryStatFields({ characterId: character.id, interaction }),
    ])
}
