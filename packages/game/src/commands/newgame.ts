import { SlashCommandBuilder } from '@discordjs/builders'
import { randomUUID } from 'crypto'
import moment from 'moment'

import store from '@adventure-bot/game/store'
import { newgame } from '@adventure-bot/game/store/actions'
import { actionScheduled } from '@adventure-bot/game/store/schedule/schedule'
import { CommandHandlerOptions } from '@adventure-bot/game/utils'

export const command = new SlashCommandBuilder()
  .setName('newgame')
  .setDescription('Start a new game.')

export const execute = async ({
  interaction,
}: CommandHandlerOptions): Promise<void> => {
  const starts = moment().add(1, 'second')
  store.dispatch(
    actionScheduled({
      id: randomUUID(),
      date: starts.unix(),
      event: newgame(),
    })
  )
  await interaction.editReply(
    `New game begins: ${starts.format('MMMM Do YYYY, h:mm:ss a')}`
  )
}

export default { command, execute }
