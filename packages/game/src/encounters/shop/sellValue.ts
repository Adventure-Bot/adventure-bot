import { getSaleRate } from '@adventure-bot/game/encounters/shop/getSaleRate'
import { Item } from '@adventure-bot/game/equipment'

export function sellValue(item: Item): number {
  return Math.round(getSaleRate() * item.goldValue)
}
