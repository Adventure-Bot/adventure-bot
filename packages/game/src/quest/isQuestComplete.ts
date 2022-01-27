import { User } from 'discord.js'

import { getUserCharacter } from '@adventure-bot/game/character'
import { Quest, QuestId } from '@adventure-bot/game/quest'

export const isQuestComplete = (quest: Quest): boolean =>
  quest.progress >= quest.totalRequired

export const isUserQuestComplete = (user: User, questId: QuestId): boolean => {
  const quest = getUserCharacter(user).quests[questId]
  return quest ? isQuestComplete(quest) : false
}
