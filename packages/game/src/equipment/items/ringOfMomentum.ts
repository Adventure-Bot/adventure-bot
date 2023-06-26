import { randomUUID } from 'crypto'

import { Ring } from '@adventure-bot/game/equipment'

export const ringOfMomentum = (): Ring => ({
  id: randomUUID(),
  name: 'Ring of Momentum',
  type: 'ring',
  description: 'A heavy metal ring.',
  goldValue: 1000,
  modifiers: {
    momentum: 1,
  },
  usable: true,
  equippable: true,
  sellable: true,
  tradeable: true,
})
