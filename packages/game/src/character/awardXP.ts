import store from '@adventure-bot/game/store'
import { xpAwarded } from '@adventure-bot/game/store/slices/characters'

export function awardXP({
  characterId,
  amount,
}: {
  characterId: string
  amount: number
}): void {
  store.dispatch(xpAwarded({ characterId, amount }))
}
