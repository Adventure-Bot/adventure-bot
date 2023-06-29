import { EmbedBuilder } from 'discord.js'

import {
  Character,
  decoratedName,
  primaryStatFields,
} from '@adventure-bot/game/character'

export function characterEmbed({
  character,
}: {
  character: Character
}): EmbedBuilder {
  return new EmbedBuilder()
    .setTitle(decoratedName(character))
    .setImage(character.profile)
    .addFields([...primaryStatFields({ characterId: character.id })])
}
