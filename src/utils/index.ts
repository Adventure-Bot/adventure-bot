import { CommandInteraction } from 'discord.js'

import { asset } from '@adventure-bot/utils/asset'
import { crownArt } from '@adventure-bot/utils/crownArt'
import { d, d6, d20 } from '@adventure-bot/utils/dice'
import { getRandomArrayElement } from '@adventure-bot/utils/getRandomArrayElement'
import { progressBar } from '@adventure-bot/utils/progressBar'
import { weightedRandom } from '@adventure-bot/utils/weightedRandom'
import { weightedTable } from '@adventure-bot/utils/weightedTable'

export {
  crownArt,
  getRandomArrayElement,
  progressBar,
  weightedRandom,
  asset,
  weightedTable,
  d6,
  d20,
  d,
}

export const sleep = (milliseconds: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, milliseconds))

export type CommandHandler = (interaction: CommandInteraction) => Promise<void>
