import { REST } from '@discordjs/rest'
import crypto from 'crypto'
import { Routes } from 'discord-api-types/v9'
import { readFile, writeFile } from 'fs/promises'

import commands from '@adventure-bot/game/commands'

export async function installCommands({
  token,
  clientId,
  guildId,
}: {
  token: string
  clientId: string
  guildId: string
}): Promise<void> {
  const rest = new REST({ version: '9' }).setToken(token)

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
    await rest.put(Routes.applicationGuildCommands(clientId, guildId), {
      body,
    })

    writeFile('.command-hash', commandHash)

    console.timeEnd('updating commands')
  } catch (error) {
    console.log(error)
  }
}
