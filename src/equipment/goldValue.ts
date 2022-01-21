import { CommandInteraction } from 'discord.js'
import { Emoji } from '@adventure-bot/Emoji'

export function goldValue({
  interaction,
  goldValue,
}: {
  interaction: CommandInteraction
  goldValue: number
}): string {
  return Emoji(interaction, 'gold') + ' ' + goldValue.toFixed(0)
}
