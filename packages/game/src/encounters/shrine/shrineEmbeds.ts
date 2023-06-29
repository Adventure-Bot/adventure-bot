import { CommandInteraction, EmbedBuilder } from 'discord.js'

import {
  decoratedName,
  findOrCreateCharacter,
} from '@adventure-bot/game/character'
import { Shrine } from '@adventure-bot/game/encounters/shrine'

export function shrineEmbeds({
  shrine,
  interaction,
}: {
  shrine: Shrine
  interaction: CommandInteraction
}): EmbedBuilder[] {
  const character = findOrCreateCharacter(interaction.user)
  return [
    new EmbedBuilder({
      title: `${decoratedName(character)} encountered a ${shrine.name}!`,
      description: shrine.description,
      color: shrine.color,
    })
      .setImage(shrine.image)
      .setThumbnail(character.profile),
  ]
}
