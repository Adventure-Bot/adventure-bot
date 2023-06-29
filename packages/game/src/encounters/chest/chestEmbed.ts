import { Colors, CommandInteraction, EmbedBuilder } from 'discord.js'

import {
  decoratedName,
  findOrCreateCharacter,
} from '@adventure-bot/game/character'
import { asset } from '@adventure-bot/game/utils'

import { Chest } from './chest'

export function chestEmbed(
  chest: Chest,
  interaction: CommandInteraction
): EmbedBuilder {
  const character = findOrCreateCharacter(interaction.user)
  const embed = new EmbedBuilder({
    title: `${decoratedName(character)} encountered a chest!`,
    color: Colors.Gold,
    description: `You found a treasure chest! What wonders wait within?`,
  })
    .setImage(asset('fantasy', 'items', 'chest', interaction.id).s3Url)
    .setThumbnail(character.profile)

  return embed
}
