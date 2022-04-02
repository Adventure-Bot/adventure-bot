import { EmojiValue, d20Emoji } from '@adventure-bot/game/Emoji'
import { TrapAttackResult } from '@adventure-bot/game/trap'

const bonusText = (attackBonus: number): string =>
  attackBonus ? `+${attackBonus}` : ''

const comparison = (result: TrapAttackResult): string =>
  result.outcome === 'hit' ? '≥' : '<'

export const trapRollText = (result: TrapAttackResult): string =>
  `${d20Emoji(result.attackRoll) + bonusText(result.attackBonus)} ${comparison(
    result
  )} ${EmojiValue('ac', result.defender.statsModified.ac)}`
