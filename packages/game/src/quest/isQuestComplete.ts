import { Quest } from '@adventure-bot/game/quest'

export const isQuestComplete = (quest: Quest): boolean =>
  quest.progress >= quest.totalRequired
