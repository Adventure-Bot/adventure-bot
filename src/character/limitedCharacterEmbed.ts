import { CommandInteraction, MessageEmbed } from 'discord.js'

import { Character } from '@adventure-bot/character/Character'
import { decoratedName } from '@adventure-bot/character/decoratedName'
import { primaryStatFields } from '@adventure-bot/character/primaryStatFields'

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
