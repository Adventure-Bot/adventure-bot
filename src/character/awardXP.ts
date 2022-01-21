import store from '@adventure-bot/store'
import { xpAwarded } from '@adventure-bot/store/slices/characters'

export const awardXP = (characterId: string, amount: number): void => {
  store.dispatch(xpAwarded({ characterId, amount }))
}
