import { CommandInteraction } from 'discord.js'

import { findOrCreateCharacter } from '@adventure-bot/game/character'
import questsCommand from '@adventure-bot/game/commands/quests'
import { Shrine } from '@adventure-bot/game/encounters/shrine'
import {
  isUserQuestComplete,
  updateQuestProgess,
} from '@adventure-bot/game/quest'
import { effects } from '@adventure-bot/game/statusEffects'
import store from '@adventure-bot/game/store'
import { selectCharacterEffects } from '@adventure-bot/game/store/selectors'
import { xpAwarded } from '@adventure-bot/game/store/slices/characters'
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
  const character = findOrCreateCharacter(interaction.user)
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
      character,
      effect,
      messageId,
    })
  )
  updateQuestProgess(interaction.user.id, 'blessed', 1)

  store.dispatch(
    xpAwarded({
      characterId: interaction.user.id,
      amount: 1,
      messageId,
    })
  )

  if (isUserQuestComplete(interaction.user, 'blessed'))
    await questsCommand.execute({ interaction })
}
