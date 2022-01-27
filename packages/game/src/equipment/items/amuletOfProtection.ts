import { randomUUID } from 'crypto'

import { Amulet } from '@adventure-bot/game/equipment'

export const amuletOfProtection = (): Amulet => ({
  id: randomUUID(),
  type: 'amulet',
  description: "This amulet's onyx stone offers protection from harm.",
  goldValue: 200,
  name: 'Amulet of Protection',
  modifiers: {
    ac: 2,
  },
  equippable: true,
  sellable: true,
  tradeable: true,
})
