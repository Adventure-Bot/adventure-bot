import { Message, MessageEmbed } from 'discord.js'

import { Emoji, EmojiValue } from '@adventure-bot/game/Emoji'
import {
  awardXP,
  decoratedName,
  getCharacter,
  hpBarField,
  xpGainField,
} from '@adventure-bot/game/character'
import { updateUserQuestProgess } from '@adventure-bot/game/quest'
import { trapAttack, trapRollText } from '@adventure-bot/game/trap'
import {
  CommandHandlerOptions,
  sleep,
  weightedTable,
} from '@adventure-bot/game/utils'

import { traps } from './traps'

export type Trap = {
  name: string
  image: string
  description: string
}

const getRandomTrap = (): Trap => {
  return weightedTable([
    [1, traps.glyph],
    [1, traps.ball],
  ])()
}

export const trap = async ({
  interaction,
  replyType = 'editReply',
}: CommandHandlerOptions): Promise<void> => {
  let character = getCharacter(interaction.user.id)
  if (!character) return

  const trap = getRandomTrap()
  const message = await interaction[replyType]({
    embeds: [
      new MessageEmbed({
        title: `${decoratedName(character)} encountered a ${trap.name}!`,
        color: 'RED',
        description: trap.description,
      })
        .setImage(trap.image)
        .setThumbnail(character.profile),
    ],
  })
  if (!(message instanceof Message)) return

  const result = trapAttack(character)

  await sleep(2000)
  character = getCharacter(interaction.user.id)
  if (!character) return
  switch (result.outcome) {
    case 'hit':
      awardXP(interaction.user.id, 1)
      if (character.hp > 0)
        updateUserQuestProgess(interaction.user, 'survivor', result.damage)
      await interaction.followUp({
        embeds: [
          new MessageEmbed({
            title: `${Emoji('hit')} The trap hit ${
              character.name
            } for ${EmojiValue('damage', result.damage)}!`,
            color: 'RED',
            fields: [
              xpGainField(1),
              hpBarField({ character, adjustment: -result.damage }),
            ],
          })
            .addField('Trap Attack', trapRollText(result))
            .setImage('https://imgur.com/28oehQm.png')
            .setThumbnail(character.profile),
        ],
      })
      break
    case 'miss':
      awardXP(interaction.user.id, 2)
      await interaction.followUp({
        embeds: [
          new MessageEmbed({
            title: `${Emoji('miss')} ${decoratedName(
              character
            )} deftly evaded!`,
          })
            .addField('Trap Attack', trapRollText(result))
            .addFields([xpGainField(2)])
            .setImage('https://imgur.com/gSgcrnN.png')
            .setThumbnail(character.profile),
        ],
      })
      break
  }
}
