import { randomUUID } from 'crypto'

import { Potion } from '@adventure-bot/game/equipment'

export const roguesBrew = (): Potion => ({
  id: randomUUID(),
  type: 'potion',
  description: 'magic potion with dark cloudy liquid',
  asset: 'magic potion with dark cloudy liquid',
  goldValue: 20,
  name: "Rogue's Brew",
  useEffects: {
    randomEffect: ['rogue'],
  },
  usable: true,
  equippable: false,
  sellable: true,
  tradeable: true,
})
