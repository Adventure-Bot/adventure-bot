import { CommandInteraction, MessageEmbed } from 'discord.js'

import { findOrCreateCharacter } from '@adventure-bot/game/character'
import { Shrine } from '@adventure-bot/game/encounters/shrine'
import { questProgressField } from '@adventure-bot/game/quest'

export function shrineEmbeds({
  shrine,
  interaction,
}: {
  shrine: Shrine
  interaction: CommandInteraction
}): MessageEmbed[] {
  const character = findOrCreateCharacter(interaction.user)
  const { blessed } = character.quests
  return [
    new MessageEmbed({
      title: `${character.name} encountered a ${shrine.name}!`,
      description: shrine.description,
      fields: blessed ? [questProgressField(blessed)] : [],
      color: shrine.color,
    })
      .setImage(shrine.image)
      .setThumbnail(character.profile),
  ]
}
