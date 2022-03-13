import { SlashCommandBuilder } from '@discordjs/builders'

import { listCharacters } from '@adventure-bot/game/commands/list/listCharacters'
import { listEncounters } from '@adventure-bot/game/commands/list/listEncounters'
import { listLootResults } from '@adventure-bot/game/commands/list/listLootResults'
import { listMonsters } from '@adventure-bot/game/commands/list/listMonsters'
import { CommandHandlerOptions } from '@adventure-bot/game/utils'

export const command = new SlashCommandBuilder()
  .setName('list')
  .setDescription('List something')
  .addSubcommand((option) =>
    option.setName('characters').setDescription('List all characters.')
  )
  .addSubcommand((option) =>
    option
      .setName('monsters')
      .setDescription('Previously encountered monsters.')
  )
  .addSubcommand((option) =>
    option.setName('loots').setDescription('History of loot results.')
  )
  .addSubcommand((option) =>
    option.setName('encounters').setDescription('Encounter history')
  )

export const execute = async ({
  interaction,
}: CommandHandlerOptions): Promise<void> => {
  switch (interaction.options.data[0].name) {
    case 'characters':
      listCharacters(interaction)
      break
    case 'monsters':
      listMonsters(interaction)
      break
    case 'encounters':
      listEncounters(interaction)
      break
    case 'loots':
      listLootResults(interaction)
      break
  }
}

export default { command, execute }
