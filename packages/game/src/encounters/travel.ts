import { MessageEmbed } from 'discord.js'

import {
  awardXP,
  decoratedName,
  findOrCreateCharacter,
} from '@adventure-bot/game/character'
import { isTravelersRing } from '@adventure-bot/game/equipment/items/travelersRing'
import { updateQuestProgess } from '@adventure-bot/game/quest'
import { createEffect, effects } from '@adventure-bot/game/statusEffects'
import { rugged } from '@adventure-bot/game/statusEffects/templates/rugged'
import store from '@adventure-bot/game/store'
import { selectCharacterEffects } from '@adventure-bot/game/store/selectors'
import { healed } from '@adventure-bot/game/store/slices/characters'
import { effectAdded } from '@adventure-bot/game/store/slices/statusEffects'
import { CommandHandlerOptions, asset, d } from '@adventure-bot/game/utils'

export const travel = async ({
  interaction,
  replyType = 'editReply',
}: CommandHandlerOptions): Promise<void> => {
  updateQuestProgess({
    interaction,
    characterId: interaction.user.id,
    questId: 'traveler',
    amount: 1,
  })
  const character = findOrCreateCharacter(interaction.user)
  await interaction[replyType]({
    embeds: [
      new MessageEmbed({
        title: `${decoratedName(character)} traveled.`,
        color: 'GREEN',
        description: `You travel the lands.`,
      }).setImage(asset('fantasy', 'places', 'travel').s3Url),
    ],
  })
  awardXP({
    characterId: interaction.user.id,
    amount: 1,
  })
  if (character.inventory.find(isTravelersRing)) {
    store.dispatch(
      effectAdded({
        interaction,
        character,
        effect: createEffect('invigorated'),
      })
    )
  }
  const isRugged = selectCharacterEffects(store.getState(), character.id).some(
    (effect) => effect.name === effects.rugged.name
  )
  if (isRugged) {
    await interaction.channel?.send({
      embeds: [
        new MessageEmbed({
          title: `${character.name} is rugged.`,
          color: rugged.announcementColor,
        }),
      ],
    })
    store.dispatch(
      effectAdded({
        interaction,
        character,
        effect: createEffect('invigorated'),
      })
    )
    store.dispatch(
      healed({
        character,
        amount: d(6),
      })
    )
  }
}
