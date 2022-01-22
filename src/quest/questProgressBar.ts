import { Quest } from '@adventure-bot/quest'
import { progressBar } from '@adventure-bot/utils'

export const questProgressBar = (quest: Quest): string =>
  progressBar(quest.progress / quest.totalRequired)
