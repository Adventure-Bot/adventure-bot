import { getSaleRate } from '@adventure-bot/encounters/shop/getSaleRate'
import { Item } from '@adventure-bot/equipment'

export function sellValue(item: Item): number {
  return Math.round(getSaleRate() * item.goldValue)
}
