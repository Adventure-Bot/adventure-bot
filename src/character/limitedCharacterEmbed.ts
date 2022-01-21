import { CommandInteraction, MessageEmbed } from 'discord.js'
import { Character } from '@adventure-bot/character/Character'
import { primaryStatFields } from '@adventure-bot/character/primaryStatFields'
import { decoratedName } from '@adventure-bot/character/decoratedName'

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
