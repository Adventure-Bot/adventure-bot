import { randomUUID } from 'crypto'

import { Weapon } from '@adventure-bot/game/equipment'

export const righteousHammer = (): Weapon => ({
  id: randomUUID(),
  type: 'weapon',
  name: 'Righteous Hammer',
  description: 'Gilded hammer blessed by the divine to guide true hearts.',
  damageMax: 8,
  modifiers: {
    attackBonus: 3,
    cleansing: 50,
  },
  goldValue: 1500,
  accuracyDescriptors: {
    wideMiss: ["<@attacker>'s Righteous Hammer swings wide of <@defender>"],
    nearMiss: ["<@attacker>'s Righteous Hammer misses <@defender>"],
    onTheNose: ["<@attacker>'s Righteous Hammer crushes <@defender>"],
    veryAccurate: ["<@attacker>'s Righteous Hammer pummels <@defender>"],
  },
  equippable: true,
  sellable: true,
  tradeable: true,
})
