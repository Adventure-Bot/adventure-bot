import { randomUUID } from 'crypto'

import { Potion } from '@adventure-bot/game/equipment'

export const potionOfHealing = (): Potion => ({
  id: randomUUID(),
  type: 'potion',
  description: 'magic potion with glowing red liquid',
  asset: 'magic potion with glowing red liquid',
  goldValue: 20,
  name: 'Potion of Healing',
  useEffects: {
    maxHeal: 6,
  },
  usable: true,
  equippable: false,
  sellable: true,
  tradeable: true,
})
