import { Item } from '@adventure-bot/equipment/Item'
import { getSaleRate } from '@adventure-bot/encounters/shop/getSaleRate'

export function sellValue(item: Item): number {
  return Math.round(getSaleRate() * item.goldValue)
}
