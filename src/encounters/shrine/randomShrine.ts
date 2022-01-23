import {
  armorShrine,
  attackShrine,
  slayerShrine,
  vigorShrine,
} from '@adventure-bot/encounters/shrine'
import { CommandHandler, weightedTable } from '@adventure-bot/utils'

export const randomShrine = (): CommandHandler =>
  weightedTable([
    [1, armorShrine],
    [1, attackShrine],
    [1, slayerShrine],
    [1, vigorShrine],
  ])
