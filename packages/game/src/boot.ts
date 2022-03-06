import { REST } from '@discordjs/rest'
import { isAnyOf } from '@reduxjs/toolkit'
import crypto from 'crypto'
import { Routes } from 'discord-api-types/v9'
import {
  Client,
  Intents,
  Message,
  TextChannel,
  ThreadChannel,
} from 'discord.js'
import { readFile, writeFile } from 'fs/promises'
import { debounce } from 'ts-debounce'

import {
  getUserCharacters,
  limitedCharacterEmbed,
} from '@adventure-bot/game/character'
import commands from '@adventure-bot/game/commands'
import { leaderboard } from '@adventure-bot/game/commands/leaderboard'
import store from '@adventure-bot/game/store'
import {
  characterListThreadCreated,
  characterMessageCreated,
  commandUsed,
  tick,
  winnerDeclared,
} from '@adventure-bot/game/store/actions'
import { startAppListening } from '@adventure-bot/game/store/listenerMiddleware'
import {
  selectLastChannelUsed,
  selectSovereign,
  selectWinnerAnnounced,
} from '@adventure-bot/game/store/selectors'
import {
  cleansed,
  cooldownStarted,
  created,
  damaged,
  divineBlessingGranted,
  effectAdded,
  goldGained,
  goldSet,
  healed,
  healthSet,
  itemEquipped,
  itemGiven,
  itemRemoved,
  itemSold,
  profileSet,
  questCompleted,
  questGranted,
  questProgressed,
  xpAwarded,
} from '@adventure-bot/game/store/slices/characters'

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
    console.time(interaction.commandName)
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
    console.timeEnd(interaction.commandName)
  })
  client.on('error', opts.onError)

  client.on('ready', async () => {
    console.log('🎉 Adventures begin!')
    console.timeEnd('discord client ready')
    opts.onReady(client)

    renderCharacterList(client)
  })

  client.login(opts.token)

  return client
}

export const waitForWinner: (client: Client) => void = (client) => {
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

function renderCharacterList(client: Client<boolean>) {
  listCharacters(client)
  const debouncedUpdateCharacterList = debounce(listCharacters, 1000)

  startAppListening({
    matcher: isAnyOf(
      created,
      questProgressed,
      cleansed,
      cooldownStarted,
      damaged,
      effectAdded,
      goldGained,
      goldSet,
      divineBlessingGranted,
      questGranted,
      healed,
      healthSet,
      itemEquipped,
      itemGiven,
      itemRemoved,
      itemSold,
      profileSet,
      questCompleted,
      xpAwarded
    ),
    effect: () => {
      debouncedUpdateCharacterList(client)
    },
  })
}

async function findOrCreateCharacterListThread(
  client: Client
): Promise<ThreadChannel | void> {
  const channel = client.channels.cache.get(
    selectLastChannelUsed(store.getState())
  )
  if (!(channel instanceof TextChannel)) return
  const threadId = store.getState().characterList.threadId
  const existingThread = channel.threads.cache.find(
    (thread) => thread.id === threadId
  )
  if (existingThread) return existingThread
  const thread = await channel.threads.create({
    name: 'Characters',
  })
  store.dispatch(characterListThreadCreated(thread))
  return thread
}

async function listCharacters(client: Client) {
  const thread = await findOrCreateCharacterListThread(client)
  if (!thread) return
  const { messageIdsByCharacterId } = store.getState().characterList
  console.log('listCharacters')
  const messages = await thread.messages.fetch()
  getUserCharacters()
    .filter((character) => character.xp > 0)
    .sort((a, b) => b.xp - a.xp)
    .map(async (character) => {
      if (!messageIdsByCharacterId[character.id]) {
        const message = await thread.send({
          embeds: [limitedCharacterEmbed({ character })],
        })
        if (!(message instanceof Message)) return
        store.dispatch(
          characterMessageCreated({
            character,
            message,
          })
        )
      } else {
        const message = messages.find(
          (message) => message.id === messageIdsByCharacterId[character.id]
        )
        if (!(message instanceof Message)) return
        await message.edit({
          embeds: [limitedCharacterEmbed({ character })],
        })
      }
    })
}
