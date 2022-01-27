import { REST } from '@discordjs/rest'
import crypto from 'crypto'
import { Routes } from 'discord-api-types/v9'
import Discord, { Client, Intents } from 'discord.js'
import { existsSync } from 'fs'
import { readFile, writeFile } from 'fs/promises'
import { exit } from 'process'

import commands from '@adventure-bot/commands'
import { leaderboard } from '@adventure-bot/commands/leaderboard'
import { ReduxState } from '@adventure-bot/store'
import store from '@adventure-bot/store'
import { commandUsed, tick, winnerDeclared } from '@adventure-bot/store/actions'
import {
  selectLastChannelUsed,
  selectSovereign,
  selectWinnerAnnounced,
} from '@adventure-bot/store/selectors'

type ClientOptions = {
  type: 'discord'
  token: string
  clientId: string
  channelId: string
  onBeforeInteraction: (gameState: ReduxState) => Promise<void> | void
  onAfterInteraction: (gameState: ReduxState) => Promise<void> | void
  onError: (e: Error) => void
  onReady: (client: Discord.Client) => void
}

export const assertEnv: () => void = () => {
  if (!existsSync('.env')) {
    console.error(
      '\x1b[43m\x1b[30m ⚠ Environment config required \n https://github.com/Adventure-Bot/adventure-bot/blob/main/developer-guide.md#setup-your-env \x1b[0m'
    )
    exit(1)
  }

  if (!process.env.token) {
    console.error(
      '\x1b[43m\x1b[30m ⚠ Discord token required \n https://github.com/Adventure-Bot/adventure-bot/blob/main/developer-guide.md#create-your-bot-token \x1b[0m'
    )
    exit(1)
  }
}

const installCommands = async (
  opts: Pick<ClientOptions, 'clientId' | 'channelId' | 'token'>
) => {
  const rest = new REST({ version: '9' }).setToken(opts.token)
  if (!opts.token || !opts.clientId || !opts.channelId) return

  try {
    const body = Array.from(commands.values()).map(({ command }) =>
      command.toJSON()
    )
    const commandHash = crypto
      .createHash('md5')
      .update(JSON.stringify(body))
      .digest('hex')
    const priorHash = (
      await readFile('.command-hash').catch(() => '')
    ).toString()
    if (commandHash === priorHash) {
      console.log('✅ Commands are up-to-date')
      return
    }

    console.time('updating commands')
    await rest.put(
      Routes.applicationGuildCommands(opts.clientId, opts.channelId),
      {
        body,
      }
    )

    writeFile('.command-hash', commandHash)

    console.timeEnd('updating commands')
  } catch (error) {
    console.log(error)
  }
}

export const createClient: (
  opts: ClientOptions
) => Promise<Discord.Client> = async (opts: ClientOptions) => {
  installCommands({
    clientId: opts.clientId,
    channelId: opts.channelId,
    token: opts.token,
  })

  console.time('discord client ready')
  const client = new Discord.Client({
    intents: [
      Intents.FLAGS.GUILDS,
      Intents.FLAGS.GUILD_MESSAGES,
      Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
      Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
    ],
  })

  // fixes `TypeError: Do not know how to serialize a BigInt` for store.dispatch(commandInteraction(interaction));
  // https://github.com/GoogleChromeLabs/jsbi/issues/30#issuecomment-1006086291
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ;(BigInt.prototype as any).toJSON = function () {
    return this.toString()
  }

  client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return
    store.dispatch(commandUsed(interaction))
    console.log(`command ${interaction.commandName}`)
    console.time(interaction.commandName)
    try {
      opts.onBeforeInteraction(store.getState())

      await interaction.deferReply()
      const command = commands.get(interaction.commandName)
      if (!command) {
        interaction.editReply(`Command not found ${command}`)
        return
      }
      await command.execute(interaction)

      opts.onAfterInteraction(store.getState())
    } catch (e) {
      console.error(e)
      await interaction.followUp(
        `Command \`${interaction.commandName}\` failed with error: \`${e}\``
      )
    }
    console.timeEnd(interaction.commandName)
  })
  client.on('error', opts.onError)

  client.on('ready', async () => {
    console.log('🎉 Adventures begin!')
    console.timeEnd('discord client ready')
    opts.onReady(client)
  })

  client.login(opts.token)

  return client
}

export const waitForWinner: (client: Discord.Client) => void = (client) => {
  store.subscribe(() => {
    const state = store.getState()
    const sovereign = selectSovereign(state)
    const announced = selectWinnerAnnounced(state)
    if (sovereign && !announced) {
      const lastChannelId = selectLastChannelUsed(state)
      const channel = client.channels.cache.get(lastChannelId)
      if (!channel?.isText()) return
      channel.send({
        content: `👑 ${sovereign.name} has claimed the crown! Game over!`,
        embeds: leaderboard(),
      })
      store.dispatch(winnerDeclared({ winner: sovereign }))
    }
  })
}

export const gameClock: () => void = () => {
  const serverTick = () => store.dispatch(tick())
  serverTick()
  setInterval(serverTick, 6000)
}
