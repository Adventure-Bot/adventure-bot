import store from '@adventure-bot/game/store'
import { xpAwarded } from '@adventure-bot/game/store/slices/characters'

export const awardXP = (characterId: string, amount: number): void => {
  store.dispatch(xpAwarded({ characterId, amount }))
}
