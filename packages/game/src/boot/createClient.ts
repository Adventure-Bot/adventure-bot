import { Client, Intents } from 'discord.js'

import {
  announceCrownLoots,
  announceEffectAdded,
  announceItemsReceived,
  announceLoots,
  announceTrapAttacked,
  announceWinners,
} from '@adventure-bot/game/announcements'
import { announceNewgames } from '@adventure-bot/game/announcements/announceNewgames'
import commands from '@adventure-bot/game/commands'
import store from '@adventure-bot/game/store'
import { commandUsed } from '@adventure-bot/game/store/actions'
import { dispatchScheduledActions } from '@adventure-bot/game/store/schedule/dispatchScheduledActions'

import { setupGuild } from './setupGuild'

export async function createClient({
  token,
  onError,
}: {
  token: string
  onError: (e: Error) => void
}): Promise<Client<boolean>> {
  console.time('createClient')

  console.time('discord client ready')
  const client = new Client({
    intents: [
      Intents.FLAGS.GUILDS,
      Intents.FLAGS.GUILD_MESSAGES,
      Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
      Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
    ],
  })
  ;(BigInt.prototype as any).toJSON = function () {
    return this.toString()
  }

  client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return
    store.dispatch(commandUsed(interaction))
    console.log(`command ${interaction.commandName}`)
    console.time(interaction.commandName + ' ' + interaction.id)
    try {
      await interaction.deferReply()
      const command = commands.get(interaction.commandName)
      if (!command) {
        interaction.editReply(`Command not found ${interaction.commandName}`)
        return
      }
      await command.execute({ interaction })
    } catch (e) {
      console.error(e)
      try {
        await interaction.followUp(
          `Command \`${interaction.commandName}\` failed with error: \`${e}\``
        )
      } catch {
        console.error(`Failed to respond to interaction id ${interaction.id}`)
      }
    }
    console.timeEnd(interaction.commandName + ' ' + interaction.id)
  })
  client.on('error', onError)

  client.on('ready', async () => {
    console.log('🎉 Adventures begin!')
    console.timeEnd('discord client ready')
    announceWinners(client)
    announceItemsReceived()
    announceEffectAdded(client)
    announceCrownLoots(client)
    announceLoots(client)
    announceTrapAttacked(client)
    dispatchScheduledActions()
    announceNewgames(client)
    client.guilds.cache.forEach(async (guild) => {
      console.log(`guild ${guild.name}`)
      setupGuild({ guild, client })
    })
  })
  console.time('login')
  await client.login(token)
  console.timeEnd('login')

  console.timeEnd('createClient')

  return client
}
