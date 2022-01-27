import { SlashCommandBuilder } from '@discordjs/builders'
import { CommandInteraction, MessageEmbed } from 'discord.js'

import {
  getUserCharacter,
  isCharacterOnCooldown,
  startCooldown,
} from '@adventure-bot/game/character'
import cooldowns from '@adventure-bot/game/commands/cooldowns'
import { randomEncounter } from '@adventure-bot/game/encounters'

export const command = new SlashCommandBuilder()
  .setName('adventure')
  .setDescription('Set off in search of glory.')

export const execute = async (
  interaction: CommandInteraction
): Promise<void> => {
  const player = getUserCharacter(interaction.user)
  if (player.hp === 0) {
    await interaction.editReply({
      embeds: [
        new MessageEmbed()
          .setDescription(`You're too weak to press on.`)
          .setImage('https://imgur.com/uD06Okr.png'),
      ],
    })
    return
  }
  if (isCharacterOnCooldown(player.id, 'adventure')) {
    await cooldowns.execute(interaction)
    return
  }
  startCooldown({ characterId: player.id, cooldown: 'adventure' })
  const encounter = randomEncounter(interaction)
  console.log(encounter)
  await encounter(interaction)
}

export default { command, execute }
