import { randomUUID } from 'crypto'

import { Armor } from '@adventure-bot/game/equipment'

export const berserkerHides = (): Armor => ({
  id: randomUUID(),
  type: 'armor',
  description: 'Cloth and hides roughly stitched.',
  goldValue: 80,
  name: 'berserker hides',
  modifiers: {
    ac: 2,
    damageMax: +1,
    maxHP: +3,
  },
  equippable: true,
  sellable: true,
  tradeable: true,
})
