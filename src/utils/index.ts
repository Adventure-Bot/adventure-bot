import { CommandInteraction } from 'discord.js'

import { crownArt } from '@adventure-bot/utils/crownArt'
import { d, d6, d20 } from '@adventure-bot/utils/dice'
import { getAsset } from '@adventure-bot/utils/getAsset'
import { getRandomArrayElement } from '@adventure-bot/utils/getRandomArrayElement'
import { progressBar } from '@adventure-bot/utils/progressBar'
import { weightedRandom } from '@adventure-bot/utils/weightedRandom'
import { weightedTable } from '@adventure-bot/utils/weightedTable'

export {
  crownArt,
  getRandomArrayElement,
  progressBar,
  weightedRandom,
  getAsset,
  weightedTable,
  d6,
  d20,
  d,
}

export const sleep = (milliseconds: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, milliseconds))

export type CommandHandler = (interaction: CommandInteraction) => Promise<void>
