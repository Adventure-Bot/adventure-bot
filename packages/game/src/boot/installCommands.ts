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
  const rest = new REST({ version: '9' }).setToken(token)

  try {
    const body = Array.from(commands.values()).map(({ command }) =>
      command.toJSON()
    )
    await rest.put(Routes.applicationGuildCommands(clientId, guildId), {
      body,
    })
  } catch (error) {
    console.log(error)
  }
}
