import { armorShrine } from '@adventure-bot/encounters/shrine/armor'
import { attackShrine } from '@adventure-bot/encounters/shrine/attack'
import { slayerShrine } from '@adventure-bot/encounters/shrine/slayer'
import { vigorShrine } from '@adventure-bot/encounters/shrine/vigor'
import { CommandHandler } from '@adventure-bot/utils'
import { weightedTable } from '@adventure-bot/utils'

export const randomShrine = (): CommandHandler =>
  weightedTable([
    [1, armorShrine],
    [1, attackShrine],
    [1, slayerShrine],
    [1, vigorShrine],
  ])
