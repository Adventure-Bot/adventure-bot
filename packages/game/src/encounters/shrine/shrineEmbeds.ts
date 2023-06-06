import { CommandInteraction, MessageEmbed } from 'discord.js'

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
}): MessageEmbed[] {
  const character = findOrCreateCharacter(interaction.user)
  return [
    new MessageEmbed({
      title: `${decoratedName(character)} encountered a ${shrine.name}!`,
      description: shrine.description,
      color: shrine.color,
    })
      .setImage(shrine.image)
      .setThumbnail(character.profile),
  ]
}
