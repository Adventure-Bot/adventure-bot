import { progressBar } from '@adventure-bot/utils/progress-bar'
import { Quest } from '@adventure-bot/quest/Quest'

export const questProgressBar = (quest: Quest): string =>
  progressBar(quest.progress / quest.totalRequired)
