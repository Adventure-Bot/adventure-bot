import { CommandInteraction, MessageEmbed } from 'discord.js'

import {
  Character,
  decoratedName,
  primaryStatFields,
} from '@adventure-bot/game/character'

export function limitedCharacterEmbed({
  character,
  interaction,
  adjustment = 0,
}: {
  character: Character
  interaction: CommandInteraction
  adjustment?: number
}): MessageEmbed {
  return new MessageEmbed({
    title: decoratedName(character),
    fields: primaryStatFields({
      characterId: character.id,
      adjustment,
      interaction,
    }),
  }).setThumbnail(character.profile)
}
