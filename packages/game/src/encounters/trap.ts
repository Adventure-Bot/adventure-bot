import { Colors, EmbedBuilder } from 'discord.js'

import {
  decoratedName,
  findOrCreateCharacter,
} from '@adventure-bot/game/character'
import {
  TrapWithStats,
  getRandomTrap,
  trapAttack,
} from '@adventure-bot/game/trap'
import { CommandHandlerOptions, sleep } from '@adventure-bot/game/utils'

export const trap = async ({
  interaction,

  trap = getRandomTrap(),
}: CommandHandlerOptions & { trap?: TrapWithStats }): Promise<void> => {
  const character = findOrCreateCharacter(interaction.user)

  const embed = new EmbedBuilder({
    title: `${decoratedName(character)} encountered a ${trap.name}!`,
    color: Colors.Red,
    description: trap.attackText,
  })
    .setImage(trap.profile)
    .setThumbnail(character.profile)

  await interaction.channel?.send({
    embeds: [embed],
  })
  await sleep(2000)
  trapAttack({ interaction, defender: character, trap })
}
