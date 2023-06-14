import store from '@adventure-bot/game/store'
import { startAppListening } from '@adventure-bot/game/store/listenerMiddleware'
import { selectCharacterById } from '@adventure-bot/game/store/selectors'
import {
  questObjectiveReached,
  questProgressed,
} from '@adventure-bot/game/store/slices/characters'

// When a player completes a quest, dispatch an event
export function dispatchQuestObjectiveReached(): void {
  startAppListening({
    actionCreator: questProgressed,
    effect: ({ payload: { amount, characterId, questId } }) => {
      const character = selectCharacterById(store.getState(), characterId)
      if (!character) return
      const quest = character.quests[questId]
      if (!quest) return
      if (quest.progress + amount < quest.totalRequired) return
      store.dispatch(questObjectiveReached())
    },
  })
}
