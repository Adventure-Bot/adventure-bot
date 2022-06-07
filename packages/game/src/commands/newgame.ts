import { SlashCommandBuilder } from '@discordjs/builders'
import * as chrono from 'chrono-node'
import { MessageEmbed } from 'discord.js'
import moment from 'moment'

import store from '@adventure-bot/game/store'
import { newgame } from '@adventure-bot/game/store/actions'
import { actionScheduled } from '@adventure-bot/game/store/schedule/schedule'
import { CommandHandlerOptions } from '@adventure-bot/game/utils'

export const command = new SlashCommandBuilder()
  .setDefaultPermission(false)
  .setName('newgame')
  .setDescription('Start a new game.')
  .addStringOption((input) =>
    input.setRequired(true).setName('when').setDescription('When do we start?')
  )

export const execute = async ({
  interaction,
}: CommandHandlerOptions): Promise<void> => {
  const input = interaction.options.getString('when')
  if (!input) {
    await interaction.editReply('Please specify when you want to start.')
    return
  }
  const date = chrono.parseDate(input)
  if (!date) {
    await interaction.editReply('Invalid date.')
    return
  }
  store.dispatch(
    actionScheduled({
      id: 'newgame',
      date: date.valueOf(),
      action: newgame(),
    })
  )
  await interaction.editReply({
    embeds: [
      new MessageEmbed({
        title: `New game will begin ${moment(date).fromNow()}`,
        description: `The next game will begin ${moment(date).format(
          'h:mm a [on] dddd, [the] Do [day of] MMMM, YYYY'
        )}`,
      }).setTimestamp(date),
    ],
  })
}

export default { command, execute }
