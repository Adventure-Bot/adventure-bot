import { CommandInteraction } from 'discord.js'

import { getUserCharacter } from '@adventure-bot/character'
import { buffQuestReward } from '@adventure-bot/quest/rewards/buffQuestReward'
import { healerStatus } from '@adventure-bot/quest/rewards/healerStatus'

export const healerQuestReward = async (
  interaction: CommandInteraction
): Promise<void> => {
  const quest = getUserCharacter(interaction.user).quests.healer
  if (!quest) return
  buffQuestReward(interaction, healerStatus, quest)
}
