import { SlashCommandBuilder } from '@discordjs/builders'
import { CommandInteraction } from 'discord.js'

import {
  characterEmbed,
  getCharacterUpdate,
  getUserCharacter,
  inventoryFields,
  loot,
  lootResultEmbed,
} from '@adventure-bot/game/character'
import { monsterEmbed, randomMonster } from '@adventure-bot/game/monster'

export const command = new SlashCommandBuilder()
  .setName('lootme')
  .setDescription(
    'Be knocked out and dragged off by some random monstrocity. Who put this command here and why?'
  )

export const execute = async (
  interaction: CommandInteraction
): Promise<void> => {
  const monster = randomMonster()
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
