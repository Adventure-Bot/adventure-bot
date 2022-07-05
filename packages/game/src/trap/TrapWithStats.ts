import { Stats } from '@adventure-bot/game/character'
import { Trap } from '@adventure-bot/game/trap/Trap'

export type TrapWithStats = Trap & {
  stats: Stats
  statsModified: Stats
}
