import { REST } from '@discordjs/rest'
import crypto from 'crypto'
import { Routes } from 'discord-api-types/v9'
import { Client, Intents } from 'discord.js'
import { readFile, writeFile } from 'fs/promises'

import { renderCharacterList } from '@adventure-bot/game/character'
import commands from '@adventure-bot/game/commands'
import { announceLoots as announceCrownLoots } from '@adventure-bot/game/crown/announceLoots'
import { declareWinners } from '@adventure-bot/game/crown/declareWinners'
import store from '@adventure-bot/game/store'
import { commandUsed } from '@adventure-bot/game/store/actions'

type ClientOptions = {
  type: 'discord'
  token: string
  clientId: string
  channelId: string
  onError: (e: Error) => void
  onReady: (client: Client) => void
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

export const createClient: (opts: ClientOptions) => Promise<Client> = async (
  opts: ClientOptions
) => {
  installCommands({
    clientId: opts.clientId,
    channelId: opts.channelId,
    token: opts.token,
  })

  console.time('discord client ready')
  const client = new Client({
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
    console.time(interaction.commandName + ' ' + interaction.id)
    try {
      await interaction.deferReply()
      const command = commands.get(interaction.commandName)
      if (!command) {
        interaction.editReply(`Command not found ${command}`)
        return
      }
      await command.execute(interaction)
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
  client.on('error', opts.onError)

  client.on('ready', async () => {
    console.log('🎉 Adventures begin!')
    console.timeEnd('discord client ready')
    opts.onReady(client)
    declareWinners(client)
    announceCrownLoots(client)

    renderCharacterList(client)
  })

  client.login(opts.token)

  return client
}
