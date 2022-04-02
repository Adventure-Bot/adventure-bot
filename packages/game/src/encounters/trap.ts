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
  asset,
  sleep,
  weightedTable,
} from '@adventure-bot/game/utils'

type Trap = {
  name: string
  image: string
  description: string
}

const traps: Record<string, () => Trap> = {
  glyph: () => ({
    name: 'glyph trap',
    description: 'As your foot hits the ground, runes begin to glow!',
    image: asset(
      'fantasy',
      'places',
      'dungeon floor with glowing magical glyphs'
    ).s3Url,
  }),
  ball: () => ({
    name: 'stone ball trap',
    description: 'A huge stone ball comes bowling down on you!',
    image: 'https://imgur.com/TDMLxyE.png',
  }),
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
