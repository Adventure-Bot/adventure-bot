import { Message, MessageEmbed } from 'discord.js'

import {
  awardXP,
  decoratedName,
  findOrCreateCharacter,
  getCharacter,
  hpBarField,
  xpGainField,
} from '@adventure-bot/game/character'
import { updateUserQuestProgess } from '@adventure-bot/game/quest'
import {
  Trap,
  getRandomTrap,
  trapAttack,
  trapRollText,
} from '@adventure-bot/game/trap'
import { CommandHandlerOptions, sleep } from '@adventure-bot/game/utils'

export const trap = async ({
  interaction,
  replyType = 'editReply',
  trap = getRandomTrap(),
}: CommandHandlerOptions & { trap?: Trap }): Promise<void> => {
  findOrCreateCharacter(interaction.user)
  let character = getCharacter(interaction.user.id)
  if (!character) return

  const embed = new MessageEmbed({
    title: `${decoratedName(character)} encountered a ${trap.name}!`,
    color: 'RED',
    description: trap.description,
  })
    .setImage(trap.image)
    .setThumbnail(character.profile)

  const message = await interaction[replyType]({
    embeds: [embed],
  })
  if (!(message instanceof Message)) return

  await sleep(2000)
  const result = trapAttack({ defender: character, trap })
  embed.addField('Trap Attack', trapRollText(result))

  character = getCharacter(interaction.user.id)
  if (!character) return
  switch (result.outcome) {
    case 'hit':
      awardXP(interaction.user.id, 1)
      embed.addFields([
        xpGainField(1),
        hpBarField({ character, adjustment: -result.damage }),
      ])
      if (character.hp > 0)
        updateUserQuestProgess(interaction.user, 'survivor', result.damage)
      break
    case 'miss':
      awardXP(interaction.user.id, 2)
      embed.addFields([xpGainField(2)])
      break
  }
  await message.edit({
    embeds: [embed],
  })
}
