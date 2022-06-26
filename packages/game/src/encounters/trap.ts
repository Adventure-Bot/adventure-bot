import { Message, MessageEmbed } from 'discord.js'

import {
  decoratedName,
  findOrCreateCharacter,
} from '@adventure-bot/game/character'
import { Trap, getRandomTrap, trapAttack } from '@adventure-bot/game/trap'
import { CommandHandlerOptions, sleep } from '@adventure-bot/game/utils'

export const trap = async ({
  interaction,
  replyType = 'editReply',
  trap = getRandomTrap(),
}: CommandHandlerOptions & { trap?: Trap }): Promise<void> => {
  const character = findOrCreateCharacter(interaction.user)

  const embed = new MessageEmbed({
    title: `${decoratedName(character)} encountered a ${trap.name}!`,
    color: 'RED',
    description: trap.attackText,
  })
    .setImage(trap.image)
    .setThumbnail(character.profile)

  const message = await interaction[replyType]({
    embeds: [embed],
  })
  if (!(message instanceof Message)) return

  await sleep(2000)
  trapAttack({ defender: character, trap })
}
