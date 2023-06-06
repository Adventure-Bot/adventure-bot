import { QuestId } from '@adventure-bot/game/quest'
import store from '@adventure-bot/game/store'
import { questProgressed } from '@adventure-bot/game/store/slices/characters'

export const updateQuestProgess = (
  characterId: string,
  questId: QuestId,
  amount: number
): void => {
  store.dispatch(
    questProgressed({
      characterId,
      questId,
      amount,
    })
  )
}
