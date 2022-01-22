import { User } from 'discord.js'

import { getUserCharacter } from '@adventure-bot/character'
import { Quest } from '@adventure-bot/quest/Quest'
import { QuestId } from '@adventure-bot/quest/quests'

export const isQuestComplete = (quest: Quest): boolean =>
  quest.progress >= quest.totalRequired

export const isUserQuestComplete = (user: User, questId: QuestId): boolean => {
  const quest = getUserCharacter(user).quests[questId]
  return quest ? isQuestComplete(quest) : false
}
