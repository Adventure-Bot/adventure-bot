import { randomUUID } from 'crypto'
import { Shield } from '@adventure-bot/equipment/equipment'

export const buckler = (): Shield => ({
  id: randomUUID(),
  type: 'shield',
  description: "A small and nimble shield that doesn't get in the way.",
  goldValue: 20,
  name: 'buckler',
  modifiers: {
    ac: 1,
  },
  equippable: true,
  sellable: true,
  tradeable: true,
})
