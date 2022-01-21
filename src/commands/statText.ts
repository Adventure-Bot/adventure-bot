import { CommandInteraction } from 'discord.js'
import { Character } from '@adventure-bot/character/Character'
import { getCharacterStatModifier } from '@adventure-bot/character/getCharacterStatModifier'
import { getCharacterStatModified } from '@adventure-bot/character/getCharacterStatModified'
import { Stat } from '@adventure-bot/character/Stats'
import { Emoji } from '@adventure-bot/Emoji'

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
