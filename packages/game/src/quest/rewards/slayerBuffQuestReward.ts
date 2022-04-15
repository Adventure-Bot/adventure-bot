import { CommandInteraction } from 'discord.js'

import { findOrCreateCharacter } from '@adventure-bot/game/character'
import { buffQuestReward } from '@adventure-bot/game/quest'
import { createEffect } from '@adventure-bot/game/statusEffects'

export const slayerBuffQuestReward = async (
  interaction: CommandInteraction
): Promise<void> => {
  const character = findOrCreateCharacter(interaction.user)
  const quest = character.quests.slayer
  if (!quest) return
  buffQuestReward(interaction, createEffect('slayer'), quest)
}
