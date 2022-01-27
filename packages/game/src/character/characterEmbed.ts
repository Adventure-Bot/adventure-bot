import { CommandInteraction, MessageEmbed } from 'discord.js'

import {
  Character,
  decoratedName,
  primaryStatFields,
} from '@adventure-bot/game/character'

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
