import { randomUUID } from 'crypto'

import { Potion } from '@adventure-bot/game/equipment'

export const potionOfMight = (): Potion => ({
  id: randomUUID(),
  type: 'potion',
  description: 'magic potion with glowing red liquid',
  asset: 'magic potion with glowing red liquid',
  goldValue: 20,
  name: 'Potion of Might',
  useEffects: {
    randomEffect: ['might'],
  },
  usable: true,
  equippable: false,
  sellable: true,
  tradeable: true,
})
