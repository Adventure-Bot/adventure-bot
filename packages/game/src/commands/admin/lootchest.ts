import { SlashCommandBuilder } from '@discordjs/builders'

import { chest } from '@adventure-bot/game/encounters'
import { CommandHandlerOptions } from '@adventure-bot/game/utils'

export const command = new SlashCommandBuilder()
  .setName('lootchest')
  .setDescription('Loot a random chest.')

export const execute = async ({
  interaction,
}: CommandHandlerOptions): Promise<void> => {
  await chest(
    { interaction },
    {
      hasLock: false,
      hasTrap: false,
      isLocked: false,
      inspected: true,
      isLooted: false,
      isTrapped: false,
    }
  )
}

export default { command, execute }
