import { SlashCommandBuilder } from '@discordjs/builders'
import { MessageEmbed } from 'discord.js'
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
  const starts = moment().add(1, 'minute')
  store.dispatch(
    actionScheduled({
      id: 'newgame',
      date: starts.valueOf(),
      event: newgame(),
    })
  )
  await interaction.editReply({
    embeds: [
      new MessageEmbed({
        title: 'New game scheduled',
        description: `The game will start in ${starts.fromNow()}.`,
      }), // TODO: .setImage
    ],
  })
}

export default { command, execute }
