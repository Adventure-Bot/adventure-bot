import { randomUUID } from 'crypto'

import { Weapon } from '@adventure-bot/equipment/equipment'

export const warAxe = (): Weapon => ({
  id: randomUUID(),
  type: 'weapon',
  name: 'war axe',
  description: 'an axe made for war',
  damageMax: 6,
  modifiers: {
    maxHP: 2,
  },
  goldValue: 30,
  accuracyDescriptors: {
    wideMiss: [
      "<@attacker>'s war axe slashes in the approximate direction of <@defender>",
    ],
    nearMiss: ["<@attacker>'d war axe nearly cuts <@defender>"],
    onTheNose: ["<@attacker>'s war axe chops <@defender>"],
    veryAccurate: ["<@attacker>'s war axe cleaves <@defender> through!"],
  },
  equippable: true,
  sellable: true,
  tradeable: true,
})
