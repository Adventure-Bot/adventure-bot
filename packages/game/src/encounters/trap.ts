import { Message, MessageEmbed } from 'discord.js'

import {
  awardXP,
  decoratedName,
  getUserCharacter,
  hpBarField,
  xpGainField,
} from '@adventure-bot/game/character'
import { updateUserQuestProgess } from '@adventure-bot/game/quest'
import { trapAttack, trapRollText } from '@adventure-bot/game/trap'
import { CommandHandlerOptions, sleep } from '@adventure-bot/game/utils'

export const trap = async ({
  interaction,
  replyType = 'editReply',
}: CommandHandlerOptions): Promise<void> => {
  let character = getUserCharacter(interaction.user)
  const message = await interaction[replyType]({
    embeds: [
      new MessageEmbed({
        title: `${decoratedName(character)} encountered a trap!`,
        color: 'RED',
        description: `${decoratedName(character)}`,
      }).setImage('https://imgur.com/TDMLxyE.png'),
    ],
  })
  if (!(message instanceof Message)) return
  const result = trapAttack(interaction.user.id)

  if (!result) {
    await interaction.editReply('No result. This should not happen.')
    return
  }
  await sleep(2000)
  character = getUserCharacter(interaction.user)
  switch (result.outcome) {
    case 'hit':
      awardXP(interaction.user.id, 1)
      if (character.hp > 0)
        updateUserQuestProgess(interaction.user, 'survivor', result.damage)
      await interaction.followUp({
        embeds: [
          new MessageEmbed({
            title: `The trap hit ${character.name} for ${result.damage}!`,
            color: 'RED',
            fields: [
              xpGainField(1),
              hpBarField({ character, adjustment: -result.damage }),
            ],
          })
            .addField('Roll', trapRollText(result))
            .setImage('https://imgur.com/28oehQm.png'),
        ],
      })
      break
    case 'miss':
      awardXP(interaction.user.id, 2)
      await interaction.followUp({
        embeds: [
          new MessageEmbed({
            title: `${decoratedName(character)} deftly evaded!`,
          })
            .addField('Roll', trapRollText(result))
            .addFields([xpGainField(2)])
            .setImage('https://imgur.com/gSgcrnN.png'),
        ],
      })
      break
  }
}
