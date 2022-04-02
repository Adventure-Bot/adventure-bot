import { trapAttack } from '@adventure-bot/game/trap'

export const trapRollText = (result: ReturnType<typeof trapAttack>): string =>
  result
    ? `${result.attackRoll}+${result.attackBonus} (${
        result.attackRoll + result.attackBonus
      }) vs ${result.defender.statsModified.ac} ac${
        result.outcome === 'hit' ? ` for ${result.damage} damage` : ''
      }.`
    : 'No result'
