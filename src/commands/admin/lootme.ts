import { SlashCommandBuilder } from '@discordjs/builders'
import { CommandInteraction } from 'discord.js'
import { characterEmbed } from '../../character/characterEmbed'
import { getCharacterUpdate } from '../../character/getCharacterUpdate'
import { getUserCharacter } from '../../character/getUserCharacter'
import { inventoryFields } from '../../character/inventoryFields'
import { loot } from '../../character/loot/loot'
import { lootResultEmbed } from '../../character/loot/lootResultEmbed'
import { getRandomMonster } from '../../monster/getRandomMonster'
import { monsterEmbed } from '../../encounters/utils/monsterEmbed'

export const command = new SlashCommandBuilder()
  .setName('lootme')
  .setDescription(
    'Be knocked out and dragged off by some random monstrocity. Who put this command here and why?'
  )

export const execute = async (
  interaction: CommandInteraction
): Promise<void> => {
  const monster = getRandomMonster()
  const character = getUserCharacter(interaction.user)
  const result = await loot({
    looterId: monster.id,
    targetId: interaction.user.id,
    interaction,
  })
  interaction.editReply({
    embeds: [
      monsterEmbed(monster),
      characterEmbed({
        character: getCharacterUpdate(character),
        interaction,
      }).addFields(...inventoryFields(character)),
    ].concat(result ? lootResultEmbed({ result, interaction }) : []),
  })
}

export default { command, execute }
