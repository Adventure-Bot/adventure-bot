import { SlashCommandBuilder } from '@discordjs/builders'

import {
  characterEmbed,
  findOrCreateCharacter,
  getCharacterUpdate,
  inventoryFields,
  loot,
  lootResultEmbed,
} from '@adventure-bot/game/character'
import { monsterEmbed, randomMonster } from '@adventure-bot/game/monster'
import store from '@adventure-bot/game/store'
import { selectMonsterById } from '@adventure-bot/game/store/selectors'
import { CommandHandlerOptions } from '@adventure-bot/game/utils'

1

export const command = new SlashCommandBuilder()
  .setName('lootmonster')
  .setDescription('Loot a random monster.')

export const execute = async ({
  interaction,
}: CommandHandlerOptions): Promise<void> => {
  const monster = randomMonster()
  const character = findOrCreateCharacter(interaction.user)
  const result = await loot({
    looterId: character.id,
    targetId: monster.id,
    interaction,
  })

  const updatedMonster = selectMonsterById(store.getState(), monster.id)

  if (!updatedMonster) {
    interaction.editReply(`Monster not found ${monster.id}`)
    return
  }
  interaction.editReply({
    embeds: [
      monsterEmbed(updatedMonster),
      characterEmbed({
        character: getCharacterUpdate(character),
      }).addFields(...inventoryFields(character)),
    ].concat(result ? lootResultEmbed({ result, interaction }) : []),
  })
}

export default { command, execute }
