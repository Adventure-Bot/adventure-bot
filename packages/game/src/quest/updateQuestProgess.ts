import { QuestId } from '@adventure-bot/game/quest'
import store from '@adventure-bot/game/store'
import { selectCharacterById } from '@adventure-bot/game/store/selectors'
import { questProgressed } from '@adventure-bot/game/store/slices/characters'

export const updateQuestProgess = (
  characterId: string,
  questId: QuestId,
  amount: number
): void => {
  const character = selectCharacterById(store.getState(), characterId)
  if (!character) return
  const quest = character.quests[questId]
  if (!quest) return
  if (quest.progress >= quest.totalRequired) return

  store.dispatch(
    questProgressed({
      characterId,
      questId,
      amount,
    })
  )
}
