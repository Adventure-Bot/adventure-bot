import { updateQuestProgess } from '@adventure-bot/game/quest'
import { startAppListening } from '@adventure-bot/game/store/listenerMiddleware'
import { effectAdded } from '@adventure-bot/game/store/slices/statusEffects'

// When a player receives a debuff, update their affliction quest progress
export function updateAfflictionQuests(): void {
  startAppListening({
    actionCreator: effectAdded,
    effect: ({ payload: { effect, character, interaction } }) => {
      if (effect.debuff)
        updateQuestProgess(interaction, character.id, 'afflicted', 1)
    },
  })
}
