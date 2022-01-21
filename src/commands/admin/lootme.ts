import { SlashCommandBuilder } from '@discordjs/builders'
import { CommandInteraction } from 'discord.js'
import { characterEmbed } from '@adventure-bot/character/characterEmbed'
import { getCharacterUpdate } from '@adventure-bot/character/getCharacterUpdate'
import { getUserCharacter } from '@adventure-bot/character/getUserCharacter'
import { inventoryFields } from '@adventure-bot/character/inventoryFields'
import { loot } from '@adventure-bot/character/loot/loot'
import { lootResultEmbed } from '@adventure-bot/character/loot/lootResultEmbed'
import { getRandomMonster } from '@adventure-bot/monster/getRandomMonster'
import { monsterEmbed } from '@adventure-bot/encounters/utils/monsterEmbed'

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
