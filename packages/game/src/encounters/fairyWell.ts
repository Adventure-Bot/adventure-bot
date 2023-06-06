import { Message, MessageEmbed } from 'discord.js'

import { Emoji } from '@adventure-bot/game/Emoji'
import {
  decoratedName,
  findOrCreateCharacter,
  hpBarField,
} from '@adventure-bot/game/character'
import quests from '@adventure-bot/game/commands/quests'
import {
  isUserQuestComplete,
  updateQuestProgess,
} from '@adventure-bot/game/quest'
import store from '@adventure-bot/game/store'
import { healed, xpAwarded } from '@adventure-bot/game/store/slices/characters'
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
        title: `${decoratedName(
          character
        )} drank from a fairy's well and gained ${Emoji(
          'heal'
        )} +${healAmount}!`,
        color: 'DARK_VIVID_PINK',
        fields: [hpBarField({ character, adjustment: healAmount })],
      }).setImage(asset('fantasy', 'places', "a fairy's well").s3Url),
    ],
  })
  if (!(message instanceof Message)) return
  store.dispatch(healed({ character, amount: healAmount }))
  store.dispatch(
    xpAwarded({
      characterId: interaction.user.id,
      amount: 1,
      messageId: message.id,
    })
  )
  updateQuestProgess(interaction.user.id, 'healer', healAmount)
  if (isUserQuestComplete(interaction.user, 'healer'))
    await quests.execute({ interaction })
}
