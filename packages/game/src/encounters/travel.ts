import { MessageEmbed } from 'discord.js'

import {
  awardXP,
  decoratedName,
  findOrCreateCharacter,
} from '@adventure-bot/game/character'
import { isTravelersRing } from '@adventure-bot/game/equipment/items/travelersRing'
import { createEffect } from '@adventure-bot/game/statusEffects'
import store from '@adventure-bot/game/store'
import { effectAdded } from '@adventure-bot/game/store/slices/statusEffects'
import { CommandHandlerOptions, asset } from '@adventure-bot/game/utils'

export const travel = async ({
  interaction,
  replyType = 'editReply',
}: CommandHandlerOptions): Promise<void> => {
  const character = findOrCreateCharacter(interaction.user)
  const message = await interaction[replyType]({
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
}
