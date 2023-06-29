import { Client, GatewayIntentBits, Partials } from 'discord.js'

import {
  announceCrownLoots,
  announceItemsReceived,
  announceLoots,
  announceNewgames,
} from '@adventure-bot/game/announcements'
import commands from '@adventure-bot/game/commands'
import {
  dispatchQuestObjectiveReached,
  updateAfflictionQuests,
} from '@adventure-bot/game/quest'
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
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.GuildEmojisAndStickers,
      GatewayIntentBits.GuildWebhooks,
      GatewayIntentBits.MessageContent,
      GatewayIntentBits.GuildMessageReactions,
    ],
    partials: [Partials.Channel, Partials.Message, Partials.Reaction],
  })
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    announceItemsReceived()
    announceCrownLoots(client)
    announceLoots(client)
    dispatchScheduledActions()
    announceNewgames(client)
    updateAfflictionQuests()
    dispatchQuestObjectiveReached()
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
