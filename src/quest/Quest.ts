import { QuestId } from '@adventure-bot/quest/quests'

export type Quest = {
  id: QuestId
  title: string
  progress: number
  totalRequired: number
  objective: string
  reward: string
  repeatable: boolean
  victoryText: string
}
