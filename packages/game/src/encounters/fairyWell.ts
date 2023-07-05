import { Message, MessageEmbed } from 'discord.js'

import {
  awardXP,
  decoratedName,
  findOrCreateCharacter,
} from '@adventure-bot/game/character'
import { updateQuestProgess } from '@adventure-bot/game/quest'
import store from '@adventure-bot/game/store'
import { healed } from '@adventure-bot/game/store/slices/characters'
import { CommandHandlerOptions, asset, d } from '@adventure-bot/game/utils'

export async function fairyWell({
  interaction,
  replyType = 'editReply',
}: CommandHandlerOptions): Promise<void> {
  const healAmount = d(6)

  const character = findOrCreateCharacter(interaction.user)
  const message = await interaction[replyType]({
    embeds: [
      new MessageEmbed({
        title: `${decoratedName(character)} drank from a fairy's well!`,
        color: 'DARK_VIVID_PINK',
      }).setImage(asset('fantasy', 'places', "a fairy's well").s3Url),
    ],
  })
  if (!(message instanceof Message)) return
  store.dispatch(healed({ character, amount: healAmount }))
  awardXP({ characterId: interaction.user.id, amount: 1 })
  updateQuestProgess({
    interaction,
    characterId: interaction.user.id,
    questId: 'healer',
    amount: healAmount,
  })
}
