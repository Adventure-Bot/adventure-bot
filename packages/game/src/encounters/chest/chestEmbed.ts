import { CommandInteraction, MessageEmbed } from 'discord.js'

import {
  decoratedName,
  findOrCreateCharacter,
} from '@adventure-bot/game/character'
import { asset } from '@adventure-bot/game/utils'

import { Chest } from './chest'

export function chestEmbed(
  chest: Chest,
  interaction: CommandInteraction
): MessageEmbed {
  const character = findOrCreateCharacter(interaction.user)
  const embed = new MessageEmbed({
    title: `${decoratedName(character)} encountered a chest!`,
    color: 'GOLD',
    description: `You found a treasure chest! What wonders wait within?`,
  })
    .setImage(
      asset(
        'fantasy',
        'items',
        'iron reinforced chest overflowing with gems and jewels',
        interaction.id
      ).s3Url
    )
    .setThumbnail(character.profile)

  return embed
}
