import { CommandInteraction } from 'discord.js'

import { getUserCharacter } from '@adventure-bot/character'
import { buffQuestReward, healerStatus } from '@adventure-bot/quest'

export const healerQuestReward = async (
  interaction: CommandInteraction
): Promise<void> => {
  const quest = getUserCharacter(interaction.user).quests.healer
  if (!quest) return
  buffQuestReward(interaction, healerStatus, quest)
}
