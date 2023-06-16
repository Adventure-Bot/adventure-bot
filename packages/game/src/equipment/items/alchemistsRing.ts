import { randomUUID } from 'crypto'

import { Ring } from '@adventure-bot/game/equipment'

export const alchemistsRing = (): Ring => ({
  id: randomUUID(),
  type: 'ring',
  name: "Alchemist's Ring",
  description: 'Every chest contains a potion.',
  goldValue: 800,
  equippable: true,
  sellable: true,
  tradeable: true,
})
