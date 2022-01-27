import { Character } from '@adventure-bot/character'
import { Quest, isQuestComplete } from '@adventure-bot/quest'

export const getCompletedQuests = (character: Character): Map<string, Quest> =>
  new Map(
    Object.entries(character.quests).filter(([, quest]) =>
      isQuestComplete(quest)
    )
  )
