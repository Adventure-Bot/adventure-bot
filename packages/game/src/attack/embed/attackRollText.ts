import { Emoji, EmojiValue, d20Emoji } from '@adventure-bot/game/Emoji'
import { AttackResult } from '@adventure-bot/game/attack'

export const attackRollText = ({
  result,
}: {
  result: AttackResult
}): string => {
  const { attackBonus } = result.attacker.statsModified
  const { ac } = result.defender.statsModified
  const { attackRoll } = result
  const bonusText = (attackBonus > 0 ? '+' : '') + (attackBonus || '')
  const comparison = ['crit', 'hit'].includes(result.outcome) ? '≥' : '<'

  return `${
    Emoji('attack') + d20Emoji(attackRoll) + bonusText
  } ${comparison} ${EmojiValue('ac', ac)}`
}
