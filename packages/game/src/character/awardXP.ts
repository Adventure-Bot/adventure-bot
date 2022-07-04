import store from '@adventure-bot/game/store'
import { xpAwarded } from '@adventure-bot/game/store/slices/characters'

export function awardXP({
  characterId,
  amount,
  messageId,
}: {
  characterId: string
  amount: number
  /**
   * If provided, the messageId will be used to link the xp award to the message
   */
  messageId?: string
}): void {
  store.dispatch(xpAwarded({ characterId, amount, messageId }))
}
