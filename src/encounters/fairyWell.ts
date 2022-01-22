import { CommandInteraction, MessageEmbed } from 'discord.js'

import { Emoji } from '@adventure-bot/Emoji'
import {
  getUserCharacter,
  hpBarField,
  xpGainField,
} from '@adventure-bot/character'
import quests from '@adventure-bot/commands/quests'
import { isUserQuestComplete, questProgressField } from '@adventure-bot/quest'
import store from '@adventure-bot/store'
import {
  healed,
  questProgressed,
  xpAwarded,
} from '@adventure-bot/store/slices/characters'
import { getAsset } from '@adventure-bot/utils'

export const fairyWell = async (
  interaction: CommandInteraction
): Promise<void> => {
  const healAmount = Math.ceil(Math.random() * 6)
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

  const character = getUserCharacter(interaction.user)
  await interaction.editReply({
    embeds: [
      new MessageEmbed({
        title: `${
          interaction.user.username
        } drinks from a fairy's well and gains ${Emoji(
          interaction,
          'heal'
        )} +${healAmount}!`,
        color: 'DARK_VIVID_PINK',
        description: `You drink from a fairy's well, it heals you for ${healAmount}!`,
        fields: [
          xpGainField(interaction, 1),
          hpBarField({ character, adjustment: healAmount }),
        ].concat(
          character.quests.healer
            ? questProgressField(character.quests.healer)
            : []
        ),
      }).setImage(getAsset('fantasy', 'places', "a fairy's well").s3Url),
    ],
  })
  if (isUserQuestComplete(interaction.user, 'healer'))
    await quests.execute(interaction)
}
