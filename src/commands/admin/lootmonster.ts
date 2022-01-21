import { SlashCommandBuilder } from '@discordjs/builders'
import { CommandInteraction } from 'discord.js'

import { characterEmbed } from '@adventure-bot/character/characterEmbed'
import { getCharacterUpdate } from '@adventure-bot/character/getCharacterUpdate'
import { getUserCharacter } from '@adventure-bot/character/getUserCharacter'
import { inventoryFields } from '@adventure-bot/character/inventoryFields'
import { loot } from '@adventure-bot/character/loot/loot'
import { lootResultEmbed } from '@adventure-bot/character/loot/lootResultEmbed'
import { monsterEmbed } from '@adventure-bot/encounters/utils/monsterEmbed'
import { getRandomMonster } from '@adventure-bot/monster/getRandomMonster'
import store from '@adventure-bot/store'
import { selectMonsterById } from '@adventure-bot/store/selectors'

export const command = new SlashCommandBuilder()
  .setName('lootmonster')
  .setDescription('Loot a random monster.')

export const execute = async (
  interaction: CommandInteraction
): Promise<void> => {
  const monster = getRandomMonster()
  const character = getUserCharacter(interaction.user)
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
        interaction,
      }).addFields(...inventoryFields(character)),
    ].concat(result ? lootResultEmbed({ result, interaction }) : []),
  })
}

export default { command, execute }
