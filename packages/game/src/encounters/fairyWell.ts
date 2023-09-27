import { Colors, EmbedBuilder, Message } from 'discord.js'

import {
  awardXP,
  decoratedName,
  findOrCreateCharacter,
} from '@adventure-bot/game/character'
import { updateQuestProgess } from '@adventure-bot/game/quest'
import store from '@adventure-bot/game/store'
import { selectCharacterEffects } from '@adventure-bot/game/store/selectors'
import { healed } from '@adventure-bot/game/store/slices/characters'
import { effectRemoved } from '@adventure-bot/game/store/slices/statusEffects'
import {
  CommandHandlerOptions,
  asset,
  d,
  randomArrayElement,
} from '@adventure-bot/game/utils'

export async function fairyWell({
  interaction,
}: CommandHandlerOptions): Promise<void> {
  const character = findOrCreateCharacter(interaction.user)
  const healAmount = d(6)

  const message = await interaction.channel?.send({
    embeds: [
      new EmbedBuilder({
        title: `${decoratedName(character)} drank from a fairy's well!`,
        color: Colors.DarkVividPink,
      }).setImage(asset('fantasy', 'places', "a fairy's well").s3Url),
    ],
  })
  if (!(message instanceof Message)) return

  store.dispatch(healed({ character, amount: healAmount }))
  awardXP({ characterId: interaction.user.id, amount: 1 })

  const debuff = randomArrayElement(
    selectCharacterEffects(store.getState(), character.id).filter(
      (effect) => effect.debuff
    )
  )
  if (debuff) {
    store.dispatch(effectRemoved({ character, effect: debuff }))
  }

  updateQuestProgess({
    interaction,
    characterId: interaction.user.id,
    questId: 'healer',
    amount: healAmount,
  })
}
