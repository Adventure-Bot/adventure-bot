import { MessageEmbed, TextChannel } from 'discord.js'

import { EmojiModifier } from '@adventure-bot/game/Emoji'
import { sendEmbeds } from '@adventure-bot/game/announcements/sendEmbeds'
import {
  awardXP,
  decoratedName,
  findOrCreateCharacter,
  hpBarField,
} from '@adventure-bot/game/character'
import questsCommand from '@adventure-bot/game/commands/quests'
import { isTravelersRing } from '@adventure-bot/game/equipment/items/travelersRing'
import {
  isUserQuestComplete,
  questProgressField,
} from '@adventure-bot/game/quest'
import { createEffect, effects } from '@adventure-bot/game/statusEffects'
import store from '@adventure-bot/game/store'
import { selectCharacterEffects } from '@adventure-bot/game/store/selectors'
import {
  healed,
  questProgressed,
} from '@adventure-bot/game/store/slices/characters'
import { effectAdded } from '@adventure-bot/game/store/slices/statusEffects'
import { CommandHandlerOptions, asset, d } from '@adventure-bot/game/utils'

export const travel = async ({
  interaction,
  replyType = 'editReply',
}: CommandHandlerOptions): Promise<void> => {
  store.dispatch(
    questProgressed({
      characterId: interaction.user.id,
      questId: 'traveler',
      amount: 1,
    })
  )
  const character = findOrCreateCharacter(interaction.user)
  const { traveler } = character.quests
  const message = await interaction[replyType]({
    embeds: [
      new MessageEmbed({
        title: `${decoratedName(character)} traveled.`,
        color: 'GREEN',
        fields: traveler ? [questProgressField(traveler)] : [],

        description: `You travel the lands.`,
      }).setImage(asset('fantasy', 'places', 'travel').s3Url),
    ],
  })
  awardXP({
    characterId: interaction.user.id,
    amount: 1,
    messageId: message.id,
  })
  if (character.inventory.find(isTravelersRing)) {
    store.dispatch(
      effectAdded({
        character,
        effect: createEffect('invigorated'),
        messageId: message.id,
      })
    )
  }
  const isRugged = selectCharacterEffects(store.getState(), character.id).some(
    (effect) => effect.name === effects.rugged.name
  )
  if (isRugged) {
    store.dispatch(
      effectAdded({
        character,
        effect: createEffect('invigorated'),
        messageId: message.id,
      })
    )
    const healAmount = d(6)
    store.dispatch(healed({ character, amount: healAmount }))
    const channel = interaction.channel
    if (channel instanceof TextChannel)
      sendEmbeds({
        channel,
        messageId: message.id,
        embeds: [
          new MessageEmbed({
            title: `${decoratedName(
              character
            )} is rugged and healed ${EmojiModifier('heal', healAmount)}!`,
            fields: [hpBarField({ character, adjustment: healAmount })],
            color: 'GREEN',
          }),
        ],
      })
  }

  if (isUserQuestComplete(interaction.user, 'traveler'))
    await questsCommand.execute({ interaction })
}
