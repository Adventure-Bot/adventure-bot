import { randomUUID } from 'crypto'

import { Weapon } from '@adventure-bot/game/equipment'

export const dagger = (): Weapon => ({
  id: randomUUID(),
  type: 'weapon',
  name: 'dagger',
  description: 'A small and nimble blade. Cheap and versatile.',
  damageMax: 4,
  modifiers: {
    attackBonus: 3,
  },
  goldValue: 20,
  accuracyDescriptors: {
    wideMiss: [
      "<@attacker>'s dagger slashes in the approximate direction of <@defender>",
    ],
    nearMiss: ["<@attacker>'s dagger nearly stabs <@defender>"],
    onTheNose: ["<@attacker>'s dagger pierces <@defender>"],
    veryAccurate: ["<@attacker>'s dagger pierces <@defender> true"],
  },
  equippable: true,
  sellable: true,
  tradeable: true,
})
