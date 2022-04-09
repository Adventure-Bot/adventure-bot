import { randomUUID } from 'crypto'

import { Ring } from '@adventure-bot/game/equipment'

export const ringOfHaste = (): Ring => ({
  id: randomUUID(),
  type: 'ring',
  name: 'Ring of Haste',
  description:
    'This ring alters your perception of time, enabling you to act more quickly.',
  modifiers: {
    haste: 10,
  },
  goldValue: 200,
  equippable: true,
  sellable: true,
  tradeable: true,
})
