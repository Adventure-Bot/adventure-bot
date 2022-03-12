import { CommandInteraction, MessageEmbed } from 'discord.js'

import {
  awardXP,
  decoratedName,
  getUserCharacter,
  xpGainField,
} from '@adventure-bot/game/character'
import { isTravelersRing } from '@adventure-bot/game/equipment/items/travelersRing'
import {
  createEffect,
  statusEffectEmbed,
} from '@adventure-bot/game/statusEffects'
import store from '@adventure-bot/game/store'
import { effectAdded } from '@adventure-bot/game/store/slices/characters'
import { asset, randomArrayElement } from '@adventure-bot/game/utils'

export const travel = async (
  interaction: CommandInteraction
): Promise<void> => {
  awardXP(interaction.user.id, 1)
  const character = getUserCharacter(interaction.user)
  const art = randomArrayElement([
    asset('fantasy', 'places', 'a lone traveler in the desert'),
    asset('fantasy', 'places', 'a lone traveler in the forest'),
    asset('fantasy', 'places', 'a lone traveler in the mountains'),
    asset('fantasy', 'places', 'a lone traveler in the plains'),
  ])
  await interaction.editReply({
    embeds: [
      new MessageEmbed({
        title: `${decoratedName(character)} traveled.`,
        color: 'GREEN',
        fields: [xpGainField(1)],
        description: `You travel the lands.`,
      }).setImage(art.s3Url),
    ],
  })
  if (character.inventory.find(isTravelersRing)) {
    const effect = createEffect('invigorated')
    store.dispatch(
      effectAdded({
        characterId: interaction.user.id,
        effect,
      })
    )
    interaction.followUp({
      embeds: [statusEffectEmbed(effect)],
    })
  }
}
