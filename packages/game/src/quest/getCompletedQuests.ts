import { Character } from '@adventure-bot/game/character'
import { Quest, isQuestComplete } from '@adventure-bot/game/quest'

export const getCompletedQuests = (character: Character): Map<string, Quest> =>
  new Map(
    Object.entries(character.quests).filter(([, quest]) =>
      isQuestComplete(quest)
    )
  )
