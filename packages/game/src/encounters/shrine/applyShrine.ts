import { CommandInteraction } from 'discord.js'

import { getUserCharacter } from '@adventure-bot/game/character'
import quests from '@adventure-bot/game/commands/quests'
import { Shrine } from '@adventure-bot/game/encounters/shrine'
import { isUserQuestComplete } from '@adventure-bot/game/quest'
import { hasStatusEffect } from '@adventure-bot/game/statusEffects'
import store from '@adventure-bot/game/store'
import {
  effectAdded,
  questProgressed,
} from '@adventure-bot/game/store/slices/characters'

export async function applyShrine({
  interaction,
  shrine,
}: {
  interaction: CommandInteraction
  shrine: Shrine
}): Promise<void> {
  const effect = shrine.effect
  if (hasStatusEffect(getUserCharacter(interaction.user), 'Blessed')) {
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

  if (isUserQuestComplete(interaction.user, 'blessed'))
    await quests.execute(interaction)
}
