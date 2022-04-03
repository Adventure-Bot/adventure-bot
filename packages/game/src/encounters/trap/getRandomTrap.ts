import { Trap, traps } from '@adventure-bot/game/encounters/trap'
import { weightedTable } from '@adventure-bot/game/utils'

export const getRandomTrap = (): Trap => {
  return weightedTable([
    [1, traps.glyph],
    [1, traps.ball],
  ])()
}
