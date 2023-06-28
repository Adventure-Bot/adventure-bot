import { randomUUID } from 'crypto'

import { Potion } from '@adventure-bot/game/equipment'

export const potionOfProtection = (): Potion => ({
  id: randomUUID(),
  type: 'potion',
  description: 'magic potion with glowing yellow liquid',
  asset: 'magic potion with glowing yellow liquid',
  goldValue: 20,
  name: 'Potion of Protection',
  useEffects: {
    randomEffect: ['protectedEffect'],
  },
  usable: true,
  equippable: false,
  sellable: true,
  tradeable: true,
})
