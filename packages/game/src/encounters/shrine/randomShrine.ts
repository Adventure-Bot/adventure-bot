import {
  armorShrine,
  attackShrine,
  slayerShrine,
  vigorShrine,
} from '@adventure-bot/game/encounters/shrine'
import { CommandHandler, weightedTable } from '@adventure-bot/game/utils'

export const randomShrine = (): CommandHandler =>
  weightedTable([
    [1, armorShrine],
    [1, attackShrine],
    [1, slayerShrine],
    [1, vigorShrine],
  ])
