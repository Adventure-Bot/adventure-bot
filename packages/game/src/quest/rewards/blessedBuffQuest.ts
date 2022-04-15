import { CommandInteraction } from 'discord.js'

import { findOrCreateCharacter } from '@adventure-bot/game/character'
import { buffQuestReward } from '@adventure-bot/game/quest'
import { createEffect } from '@adventure-bot/game/statusEffects'

export const blessedBuffQuestReward = async (
  interaction: CommandInteraction
): Promise<void> => {
  const character = findOrCreateCharacter(interaction.user)
  const quest = character.quests.blessed
  if (!quest) return
  buffQuestReward(interaction, createEffect('blessed'), quest)
}
