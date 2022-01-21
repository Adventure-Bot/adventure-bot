import { getCharacterStatModified } from '@adventure-bot/character/getCharacterStatModified'
import { trapAttack as trapAttack } from '@adventure-bot/trap/trapAttack'

export const trapRollText = (result: ReturnType<typeof trapAttack>): string =>
  result
    ? `${result.attackRoll}+${result.attackBonus} (${
        result.attackRoll + result.attackBonus
      }) vs ${getCharacterStatModified(result.defender, 'ac')} ac${
        result.outcome === 'hit' ? ` for ${result.damage} damage` : ''
      }.`
    : 'No result'
