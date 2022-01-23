import { REST } from '@discordjs/rest'
import crypto from 'crypto'
import { Routes } from 'discord-api-types/v9'
import Discord, { Intents } from 'discord.js'
import { readFile, writeFile } from 'fs/promises'
import { exit } from 'process'

import commands from '@adventure-bot/commands'
import { leaderboard } from '@adventure-bot/commands/leaderboard'
import store from '@adventure-bot/store'
import { commandUsed, tick, winnerDeclared } from '@adventure-bot/store/actions'
import {
  selectLastChannelUsed,
  selectSovereign,
  selectWinnerAnnounced,
} from '@adventure-bot/store/selectors'

console.time('ready')

if (!process.env.token) exit(1)

const rest = new REST({ version: '9' }).setToken(process.env.token)

const updateCommands = async () => {
  if (!process.env.token || !process.env.CLIENT_ID || !process.env.GUILD_ID)
    return

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
      Routes.applicationGuildCommands(
        process.env.CLIENT_ID,
        process.env.GUILD_ID
      ),
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

let client: Discord.Client

async function main() {
  updateCommands()

  console.time('discord client ready')
  client = new Discord.Client({
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
      await interaction.followUp(
        `Command \`${interaction.commandName}\` failed with error: \`${e}\``
      )
    }
    console.timeEnd(interaction.commandName)
  })
  client.on('error', (e) => {
    console.error('Discord client error!', e)
  })

  client.on('ready', async () => {
    console.log('🎉 Adventures begin!')
    console.timeEnd('discord client ready')
    startClock()
  })

  client.login(process.env.token)
}

store.subscribe(() => {
  const sovereign = selectSovereign(store.getState())
  const announced = selectWinnerAnnounced(store.getState())
  if (sovereign && !announced) {
    const lastChannelId = selectLastChannelUsed(store.getState())
    const channel = client.channels.cache.get(lastChannelId)
    if (!channel?.isText()) return
    channel.send({
      content: `👑 ${sovereign.name} has claimed the crown! Game over!`,
      embeds: leaderboard(),
    })
    store.dispatch(winnerDeclared({ winner: sovereign }))
  }
})

function startClock() {
  const serverTick = () => store.dispatch(tick())
  serverTick()
  setInterval(serverTick, 6000)
}

main()

export { client }
