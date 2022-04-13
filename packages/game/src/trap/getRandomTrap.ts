import { Trap, traps } from '@adventure-bot/game/trap'
import { weightedTable } from '@adventure-bot/game/utils'

export const getRandomTrap = (): Trap => {
  return weightedTable([
    [1, traps.glyph],
    [1, traps.ball],
    [1, traps.poisonNeedle],
    [1, traps.slowDust],
  ])()
}
