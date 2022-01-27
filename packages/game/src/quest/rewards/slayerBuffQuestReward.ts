import { CommandInteraction } from 'discord.js'

import { getUserCharacter } from '@adventure-bot/game/character'
import { buffQuestReward } from '@adventure-bot/game/quest'

export const slayerBuffQuestReward = async (
  interaction: CommandInteraction
): Promise<void> => {
  const character = getUserCharacter(interaction.user)
  const quest = character.quests.slayer
  if (!quest) return
  buffQuestReward(
    interaction,
    {
      name: 'Slayer',
      buff: true,
      debuff: false,
      duration: 4 * 60 * 60000,
      modifiers: {
        monsterDamageMax: 6,
      },
      started: new Date().toString(),
    },
    quest
  )
}
