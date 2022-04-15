import { CommandInteraction } from 'discord.js'

import { buffQuestReward } from '@adventure-bot/game/quest'
import { quests } from '@adventure-bot/game/quest/quests'
import { createEffect } from '@adventure-bot/game/statusEffects'

export const healerQuestReward = async (
  interaction: CommandInteraction
): Promise<void> => {
  buffQuestReward(interaction, createEffect('healer'), quests.healer)
}
