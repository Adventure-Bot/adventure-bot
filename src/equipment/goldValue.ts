import { CommandInteraction } from 'discord.js'

import { Emoji } from '@adventure-bot/Emoji'

export function goldValue({
  goldValue,
}: {
  interaction: CommandInteraction
  goldValue: number
}): string {
  return Emoji('gold') + ' ' + goldValue.toFixed(0)
}
