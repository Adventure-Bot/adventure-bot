import { CommandInteraction } from 'discord.js'

import quests from '@adventure-bot/game/commands/quests'
import { Shrine } from '@adventure-bot/game/encounters/shrine'
import { isUserQuestComplete } from '@adventure-bot/game/quest'
import { hasStatusEffect } from '@adventure-bot/game/statusEffects'
import store from '@adventure-bot/game/store'
import {
  questProgressed,
  xpAwarded,
} from '@adventure-bot/game/store/slices/characters'
import { effectAdded } from '@adventure-bot/game/store/slices/statusEffects'

export async function applyShrine({
  interaction,
  shrine,
}: {
  interaction: CommandInteraction
  shrine: Shrine
}): Promise<void> {
  const effect = shrine.effect
  if (
    hasStatusEffect({
      characterId: interaction.user.id,
      name: 'Blessed',
    }) &&
    effect.duration
  ) {
    effect.duration *= 2
  }
  store.dispatch(effectAdded({ characterId: interaction.user.id, effect }))

  store.dispatch(
    questProgressed({
      characterId: interaction.user.id,
      questId: 'blessed',
      amount: 1,
    })
  )

  store.dispatch(xpAwarded({ characterId: interaction.user.id, amount: 1 }))

  if (isUserQuestComplete(interaction.user, 'blessed'))
    await quests.execute({ interaction })
}
