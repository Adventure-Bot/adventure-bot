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
import { CommandHandlerOptions } from '@adventure-bot/game/utils'

export const command = new SlashCommandBuilder()
  .setName('lootme')
  .setDescription(
    'Be knocked out and dragged off by some random monstrocity. Who put this command here and why?'
  )

export const execute = async ({
  interaction,
}: CommandHandlerOptions): Promise<void> => {
  const monster = randomMonster()
  const character = findOrCreateCharacter(interaction.user)
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
      }).addFields(...inventoryFields(character)),
    ].concat(result ? lootResultEmbed({ result, interaction }) : []),
  })
}

export default { command, execute }
