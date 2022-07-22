import { REST } from '@discordjs/rest'
import { Routes } from 'discord-api-types/v9'

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
  console.time('installCommands')
  const rest = new REST({ version: '9' }).setToken(token)

  const body = Array.from(commands.values()).map(({ command }) =>
    command.toJSON()
  )
  await rest
    .put(Routes.applicationGuildCommands(clientId, guildId), {
      body,
    })
    .catch((error) => {
      console.error(error, body)
    })

  console.timeEnd('installCommands')
}
