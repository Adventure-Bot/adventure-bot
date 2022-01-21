import { randomUUID } from 'crypto'

import { Potion } from '@adventure-bot/equipment/equipment'

export const potionOfSlaying = (): Potion => ({
  id: randomUUID(),
  type: 'potion',
  description: 'magic potion with glowing green liquid',
  goldValue: 20,
  name: 'Potion of Slaying',
  useEffects: {
    randomEffect: ['slayer'],
  },
  usable: true,
  equippable: false,
  sellable: true,
  tradeable: true,
})
