import { randomUUID } from 'crypto'

import { Ring } from '@adventure-bot/game/equipment'

export const roguesRing = (): Ring => ({
  id: randomUUID(),
  type: 'ring',
  name: "Rogue's Ring",
  description:
    'This ring sports a magnifying glass, pick, and rogues rub the gem for good luck.',
  modifiers: {
    perception: 2,
    luck: 2,
    lockpicking: 2,
  },
  goldValue: 200,
  equippable: true,
  sellable: true,
  tradeable: true,
})
