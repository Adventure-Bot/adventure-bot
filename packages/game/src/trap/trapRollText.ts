import { getCharacterStatModified } from '@adventure-bot/game/character'
import { trapAttack } from '@adventure-bot/game/trap'

export const trapRollText = (result: ReturnType<typeof trapAttack>): string =>
  result
    ? `${result.attackRoll}+${result.attackBonus} (${
        result.attackRoll + result.attackBonus
      }) vs ${getCharacterStatModified(result.defender, 'ac')} ac${
        result.outcome === 'hit' ? ` for ${result.damage} damage` : ''
      }.`
    : 'No result'
