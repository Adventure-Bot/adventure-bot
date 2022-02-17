import { randomUUID } from 'crypto'

import { Armor } from '@adventure-bot/game/equipment'

export const assassinLeathers = (): Armor => ({
  id: randomUUID(),
  type: 'armor',
  description: 'Light on your feet, silent and deadly, always ready to strike.',
  goldValue: 80,
  name: 'assassin leathers',
  modifiers: {
    ac: 2,
    attackBonus: +4,
  },
  equippable: true,
  sellable: true,
  tradeable: true,
})
