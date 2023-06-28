import { randomUUID } from 'crypto'

import { Potion } from '@adventure-bot/game/equipment'

export const potionOfHaste = (): Potion => ({
  id: randomUUID(),
  type: 'potion',
  description: 'magic potion with glowing yellow liquid',
  asset: 'magic potion with glowing yellow liquid',
  goldValue: 100,
  name: 'Potion of Haste',
  useEffects: {
    randomEffect: ['haste'],
  },
  usable: true,
  equippable: false,
  sellable: true,
  tradeable: true,
})
