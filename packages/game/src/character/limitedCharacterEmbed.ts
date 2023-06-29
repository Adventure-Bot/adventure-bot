import { EmbedBuilder } from 'discord.js'

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
}): EmbedBuilder {
  return new EmbedBuilder({
    title: decoratedName(character),
    fields: primaryStatFields({
      characterId: character.id,
      adjustment,
    }),
  }).setThumbnail(character.profile)
}
