import { MessageEmbed } from 'discord.js'

import { Emoji } from '@adventure-bot/game/Emoji'
import {
  decoratedName,
  findOrCreateCharacter,
  hpBarField,
} from '@adventure-bot/game/character'
import quests from '@adventure-bot/game/commands/quests'
import {
  isUserQuestComplete,
  questProgressField,
} from '@adventure-bot/game/quest'
import store from '@adventure-bot/game/store'
import {
  healed,
  questProgressed,
  xpAwarded,
} from '@adventure-bot/game/store/slices/characters'
import { CommandHandlerOptions, asset } from '@adventure-bot/game/utils'

export async function fairyWell({
  interaction,
  replyType = 'editReply',
}: CommandHandlerOptions): Promise<void> {
  const healAmount = Math.ceil(Math.random() * 6)

  const character = findOrCreateCharacter(interaction.user)
  await interaction[replyType]({
    embeds: [
      new MessageEmbed({
        title: `${decoratedName(
          character
        )} drank from a fairy's well and gained ${Emoji(
          'heal'
        )} +${healAmount}!`,
        color: 'DARK_VIVID_PINK',
        fields: [hpBarField({ character, adjustment: healAmount })].concat(
          character.quests.healer
            ? questProgressField(character.quests.healer)
            : []
        ),
      }).setImage(asset('fantasy', 'places', "a fairy's well").s3Url),
    ],
  })
  store.dispatch(
    healed({ characterId: interaction.user.id, amount: healAmount })
  )
  store.dispatch(xpAwarded({ characterId: interaction.user.id, amount: 1 }))
  store.dispatch(
    questProgressed({
      characterId: interaction.user.id,
      questId: 'healer',
      amount: healAmount,
    })
  )
  if (isUserQuestComplete(interaction.user, 'healer'))
    await quests.execute({ interaction })
}
