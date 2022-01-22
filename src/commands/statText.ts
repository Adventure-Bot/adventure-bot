import { CommandInteraction } from 'discord.js'

import { Emoji } from '@adventure-bot/Emoji'
import {
  Character,
  Stat,
  getCharacterStatModified,
  getCharacterStatModifier,
} from '@adventure-bot/character'

export function statText({
  character,
  stat,
  interaction,
}: {
  character: Character
  stat: Stat
  interaction: CommandInteraction
}): string {
  const modified = getCharacterStatModified(character, stat)
  const modifier = getCharacterStatModifier(character, stat)
  const sign = modifier > 0 ? '+' : ''
  return (
    Emoji(interaction, stat) +
    ` ${modified}${modifier ? ` (${sign}${modifier})` : ''}`
  )
}
