import { CommandInteraction } from 'discord.js'

import { Emoji } from '@adventure-bot/game/Emoji'
import { AttackResult } from '@adventure-bot/game/attack'

export function attackResultHeadline({
  result,
}: {
  interaction: CommandInteraction
  result: AttackResult
}): string {
  const { attacker, defender } = result
  const hitOrMissed =
    result.outcome === 'crit'
      ? 'critically hit'
      : result.outcome === 'hit'
      ? 'hit'
      : 'missed'
  const forDamage = ['hit', 'crit'].includes(result.outcome)
    ? ` for ${result.damage} ${Emoji('damage')}`
    : ''

  return `${Emoji(result.outcome)} ${attacker.name} ${hitOrMissed} ${
    defender.name
  }${forDamage}!`
}
