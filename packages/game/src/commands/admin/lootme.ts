import { SlashCommandBuilder } from 'discord.js'

import { loot } from '@adventure-bot/game/character'
import { randomMonster } from '@adventure-bot/game/monster'
import { CommandHandlerOptions } from '@adventure-bot/game/utils'

export const command = new SlashCommandBuilder()
  .setName('lootme')
  .setDescription(
    'Be knocked out and dragged off by some random monstrocity. Who put this command here and why?'
  )

export const execute = async ({
  interaction,
}: CommandHandlerOptions): Promise<void> => {
  loot({
    looterId: randomMonster().id,
    targetId: interaction.user.id,
    interaction,
  })
}

export default { command, execute }
