import { Character } from '@adventure-bot/character/Character'
import { Quest } from '@adventure-bot/quest/Quest'
import { isQuestComplete } from '@adventure-bot/quest/isQuestComplete'

export const getCompletedQuests = (character: Character): Map<string, Quest> =>
  new Map(
    Object.entries(character.quests).filter(([, quest]) =>
      isQuestComplete(quest)
    )
  )
