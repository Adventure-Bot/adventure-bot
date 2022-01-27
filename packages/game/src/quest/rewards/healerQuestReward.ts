import { CommandInteraction } from 'discord.js'

import { getUserCharacter } from '@adventure-bot/game/character'
import { buffQuestReward, healerStatus } from '@adventure-bot/game/quest'

export const healerQuestReward = async (
  interaction: CommandInteraction
): Promise<void> => {
  const quest = getUserCharacter(interaction.user).quests.healer
  if (!quest) return
  buffQuestReward(interaction, healerStatus, quest)
}
