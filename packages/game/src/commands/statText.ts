import { CommandInteraction } from 'discord.js'

import { Emoji } from '@adventure-bot/game/Emoji'
import {
  Character,
  Stat,
  getCharacterStatModified,
  getCharacterStatModifier,
} from '@adventure-bot/game/character'

export function statText({
  character,
  stat,
}: {
  character: Character
  stat: Stat
  interaction: CommandInteraction
}): string {
  const modified = getCharacterStatModified(character, stat)
  const modifier = getCharacterStatModifier(character, stat)
  const sign = modifier > 0 ? '+' : ''
  return Emoji(stat) + ` ${modified}${modifier ? ` (${sign}${modifier})` : ''}`
}
