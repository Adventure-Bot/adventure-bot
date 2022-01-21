import { randomUUID } from 'crypto'
import { Ring } from '@adventure-bot/equipment/equipment'

export const ringOfAttack = (): Ring => ({
  id: randomUUID(),
  type: 'ring',
  name: 'Ring of Attack',
  description: 'A ring that increases your accuracy.',
  modifiers: {
    attackBonus: 2,
  },
  goldValue: 200,
  equippable: true,
  sellable: true,
  tradeable: true,
})
