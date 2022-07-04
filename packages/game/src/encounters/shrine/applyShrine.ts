import { CommandInteraction } from 'discord.js'

import quests from '@adventure-bot/game/commands/quests'
import { Shrine } from '@adventure-bot/game/encounters/shrine'
import { isUserQuestComplete } from '@adventure-bot/game/quest'
import { effects } from '@adventure-bot/game/statusEffects'
import store from '@adventure-bot/game/store'
import { selectCharacterEffects } from '@adventure-bot/game/store/selectors'
import {
  questProgressed,
  xpAwarded,
} from '@adventure-bot/game/store/slices/characters'
import { effectAdded } from '@adventure-bot/game/store/slices/statusEffects'

export async function applyShrine({
  interaction,
  shrine,
  messageId,
}: {
  interaction: CommandInteraction
  shrine: Shrine
  messageId: string
}): Promise<void> {
  const effect = shrine.effect
  const isBlessed = selectCharacterEffects(
    store.getState(),
    interaction.user.id
  ).some((effect) => effect.name === effects.blessed.name)
  if (effect.duration && isBlessed) {
    effect.duration *= 2
  }
  store.dispatch(
    effectAdded({
      characterId: interaction.user.id,
      effect,
      messageId,
    })
  )

  store.dispatch(
    questProgressed({
      characterId: interaction.user.id,
      questId: 'blessed',
      amount: 1,
    })
  )

  store.dispatch(
    xpAwarded({
      characterId: interaction.user.id,
      amount: 1,
      messageId,
    })
  )

  if (isUserQuestComplete(interaction.user, 'blessed'))
    await quests.execute({ interaction })
}
