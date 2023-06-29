import { REST, Routes } from 'discord.js'

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

  try {
    const body = Array.from(commands.values()).map(({ command }) =>
      command.toJSON()
    )
    console.time('updating commands')
    await rest.put(Routes.applicationGuildCommands(clientId, guildId), {
      body,
    })

    console.timeEnd('updating commands')
  } catch (error) {
    console.log(error)
  }
  console.timeEnd('installCommands')
}
