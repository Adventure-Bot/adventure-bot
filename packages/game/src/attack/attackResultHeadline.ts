import { CommandInteraction } from 'discord.js'

import { Emoji } from '@adventure-bot/Emoji'
import { AttackResult } from '@adventure-bot/attack'

export function attackResultHeadline({
  result,
}: {
  interaction: CommandInteraction
  result: AttackResult
}): string {
  const { attacker, defender } = result
  const hitOrMissed = result.outcome === 'hit' ? 'hit' : 'missed'
  const forDamage =
    result.outcome === 'hit' ? ` for ${result.damage} ${Emoji('damage')}` : ''

  return `${Emoji(result.outcome)} ${attacker.name} ${hitOrMissed} ${
    defender.name
  }${forDamage}`
}
