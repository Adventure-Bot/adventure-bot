import { CommandInteraction } from 'discord.js'

import { Emoji, EmojiValue, d20Emoji } from '@adventure-bot/game/Emoji'
import { AttackResult } from '@adventure-bot/game/attack'

export const attackRollText = ({
  result,
}: {
  result: AttackResult
  interaction: CommandInteraction
}): string => {
  const { attackBonus, ac } = result.attacker.statsModified
  const { attackRoll } = result
  const bonusText = (attackBonus > 0 ? '+' : '') + (attackBonus || '')
  const comparison = result.outcome === 'hit' ? '≥' : '<'

  return `${
    Emoji('attack') + d20Emoji(attackRoll) + bonusText
  } ${comparison} ${EmojiValue('ac', ac)}`
}
