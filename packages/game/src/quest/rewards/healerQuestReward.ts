import { CommandInteraction } from 'discord.js'

import { buffQuestReward, healerStatus } from '@adventure-bot/game/quest'
import { quests } from '@adventure-bot/game/quest/quests'

export const healerQuestReward = async (
  interaction: CommandInteraction
): Promise<void> => {
  buffQuestReward(interaction, healerStatus, quests.healer)
}
