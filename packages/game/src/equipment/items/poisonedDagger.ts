import { randomUUID } from 'crypto'

import { Weapon } from '@adventure-bot/game/equipment'

export const poisonedDagger = (): Weapon => ({
  id: randomUUID(),
  type: 'weapon',
  name: 'Venomous Blade',
  description: 'A jeweled dagger that drips with venom.',
  damageMax: 4,
  modifiers: {
    attackBonus: 3,
  },
  onHitEffect: 'poisoned',
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
