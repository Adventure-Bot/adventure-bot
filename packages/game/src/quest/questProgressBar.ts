import { Quest } from '@adventure-bot/game/quest'
import { progressBar } from '@adventure-bot/game/utils'

export const questProgressBar = (quest: Quest): string =>
  progressBar(quest.progress / quest.totalRequired)
