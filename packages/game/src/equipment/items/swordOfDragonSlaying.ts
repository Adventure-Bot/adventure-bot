import { randomUUID } from 'crypto'

import { Weapon } from '@adventure-bot/game/equipment'

export const swordOfDragonSlaying = (): Weapon => ({
  id: randomUUID(),
  type: 'weapon',
  name: 'Sword of Dragon Slaying',
  description:
    "Enchanted by wizards of the fourth age, this blade's enchantment bursts with vibrant energy when it comes in contact with dragonscale",
  damageMax: 10,
  goldValue: 40,
  modifiers: {
    dragonSlaying: 10,
  },
  accuracyDescriptors: {
    wideMiss: [
      "<@attacker>'s Sword of Dragon Slaying swings wide at <@defender>",
    ],
    nearMiss: [
      "<@attacker>'s Sword of Dragon Slaying nearly slashes <@defender>",
    ],
    onTheNose: ["<@attacker>'s Sword of Dragon Slaying slashes <@defender>"],
    veryAccurate: [
      "<@attacker>'s Sword of Dragon Slaying cuts <@defender> true",
    ],
  },
  equippable: true,
  sellable: true,
  tradeable: true,
})
