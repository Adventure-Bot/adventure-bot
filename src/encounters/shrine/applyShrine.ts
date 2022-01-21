import { CommandInteraction } from 'discord.js'
import { getUserCharacter } from '@adventure-bot/character/getUserCharacter'
import { isUserQuestComplete } from '@adventure-bot/quest/isQuestComplete'
import { hasStatusEffect } from '@adventure-bot/statusEffects/hasStatusEffect'
import quests from '@adventure-bot/commands/quests'
import { Shrine } from '@adventure-bot/shrines/Shrine'
import store from '@adventure-bot/store'
import {
  questProgressed,
  effectAdded,
} from '@adventure-bot/store/slices/characters'

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
