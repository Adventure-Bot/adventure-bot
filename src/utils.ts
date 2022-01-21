import { CommandInteraction } from 'discord.js'

import { weightedTable } from '@adventure-bot/utils/weightedTable'

export const sleep = (milliseconds: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, milliseconds))

export type CommandHandler = (interaction: CommandInteraction) => Promise<void>

export { weightedTable }
