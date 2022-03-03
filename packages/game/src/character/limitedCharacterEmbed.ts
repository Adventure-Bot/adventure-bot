import { MessageEmbed } from 'discord.js'

import {
  Character,
  decoratedName,
  primaryStatFields,
} from '@adventure-bot/game/character'

export function limitedCharacterEmbed({
  character,
  adjustment = 0,
}: {
  character: Character
  adjustment?: number
}): MessageEmbed {
  return new MessageEmbed({
    title: decoratedName(character),
    fields: primaryStatFields({
      characterId: character.id,
      adjustment,
    }),
  }).setThumbnail(character.profile)
}
