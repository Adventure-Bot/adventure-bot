import { CommandInteraction } from 'discord.js'
import { AttackResult } from '@adventure-bot/attack/AttackResult'
import { Emoji } from '@adventure-bot/Emoji'

export function attackResultHeadline({
  interaction,
  result,
}: {
  interaction: CommandInteraction
  result: AttackResult
}): string {
  const { attacker, defender } = result
  const hitOrMissed = result.outcome === 'hit' ? 'hit' : 'missed'
  const forDamage =
    result.outcome === 'hit'
      ? ` for ${result.damage} ${Emoji(interaction, 'damage')}`
      : ''

  return `${Emoji(interaction, result.outcome)} ${
    attacker.name
  } ${hitOrMissed} ${defender.name}${forDamage}`
}
