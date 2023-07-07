import { EmbedBuilder, SlashCommandBuilder } from 'discord.js'

import { Emoji } from '@adventure-bot/game/Emoji'
import {
  cooldownRemainingText,
  findOrCreateCharacter,
  isCharacterOnCooldown,
  startCooldown,
} from '@adventure-bot/game/character'
import cooldowns from '@adventure-bot/game/commands/cooldowns'
import { randomEncounter } from '@adventure-bot/game/encounters'
import { CommandHandlerOptions } from '@adventure-bot/game/utils'

export const command = new SlashCommandBuilder()
  .setName('adventure')
  .setDescription('Set off in search of glory.')

export const execute = async ({
  interaction,
}: CommandHandlerOptions): Promise<void> => {
  const character = findOrCreateCharacter(interaction.user)
  if (character.hp === 0) {
    await interaction.channel?.send({
      embeds: [
        new EmbedBuilder()
          .setDescription(`You're too weak to press on.`)
          .setImage('https://imgur.com/uD06Okr.png'),
      ],
    })
    return
  }
  if (isCharacterOnCooldown(character.id, 'adventure')) {
    await cooldowns.execute({ interaction })
    return
  }
  startCooldown({
    characterId: character.id,
    cooldown: 'adventure',
    interaction,
  })
  const encounter = randomEncounter(interaction)
  console.log(encounter)
  await encounter({ interaction })
  await interaction.channel?.send(
    character.name +
      ' can ' +
      Emoji('adventure') +
      ' again ' +
      cooldownRemainingText(character.id, 'adventure')
  )
}

export default { command, execute }
