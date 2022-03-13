import { CommandInteraction } from 'discord.js'

import { asset } from '@adventure-bot/game/utils/asset'
import { crownArt } from '@adventure-bot/game/utils/crownArt'
import { d, d6, d20 } from '@adventure-bot/game/utils/dice'
import { progressBar } from '@adventure-bot/game/utils/progressBar'
import { randomArrayElement } from '@adventure-bot/game/utils/randomArrayElement'
import { weightedRandom } from '@adventure-bot/game/utils/weightedRandom'
import { weightedTable } from '@adventure-bot/game/utils/weightedTable'

export {
  crownArt,
  randomArrayElement,
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

export type CommandHandlerOptions = {
  interaction: CommandInteraction
  replyType?: 'editReply' | 'followUp'
}

export type CommandHandler = (options: CommandHandlerOptions) => Promise<void>
