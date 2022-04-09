import { CommandInteraction } from 'discord.js'

import { findOrCreateCharacter } from '@adventure-bot/game/character'
import { buffQuestReward } from '@adventure-bot/game/quest'

export const survivorBuffQuestReward = async (
  interaction: CommandInteraction
): Promise<void> => {
  const character = findOrCreateCharacter(interaction.user)
  const quest = character.quests.survivor
  if (!quest) return
  buffQuestReward(
    interaction,
    {
      name: 'Survivor',
      buff: true,
      debuff: false,
      duration: 4 * 60 * 60000,
      modifiers: {
        maxHP: 5,
      },
      started: new Date().toString(),
    },
    quest
  )
}
