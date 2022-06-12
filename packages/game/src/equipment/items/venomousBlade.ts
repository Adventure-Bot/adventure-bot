import { randomUUID } from 'crypto'

import { Weapon } from '@adventure-bot/game/equipment'

// TODO: add to chests and shops
export const venomousBlade = (): Weapon => ({
  id: randomUUID(),
  type: 'weapon',
  name: 'Venomous Blade',
  description: 'A jeweled dagger that drips with venom.',
  damageMax: 4,
  modifiers: {
    attackBonus: 3,
  },
  onHitEffect: 'poisoned',
  goldValue: 1500,
  accuracyDescriptors: {
    wideMiss: [
      "<@attacker>'s Venomous Blade slashes in the approximate direction of <@defender>",
    ],
    nearMiss: ["<@attacker>'s Venomous Blade nearly stabs <@defender>"],
    onTheNose: ["<@attacker>'s Venomous Blade pierces <@defender>"],
    veryAccurate: ["<@attacker>'s Venomous Blade pierces <@defender> true"],
  },
  equippable: true,
  sellable: true,
  tradeable: true,
})
