import { randomUUID } from 'crypto'

import { Weapon } from '@adventure-bot/game/equipment'

export const boomstick = (): Weapon => ({
  id: randomUUID(),
  type: 'weapon',
  name: 'boomstick',
  description: 'Nobody knows what this is or how it works.',
  damageMax: 10,
  goldValue: 20,
  chanceToBackfire: 0.2,
  accuracyDescriptors: {
    wideMiss: ["<@attacker>'s boomstick blasts wide of <@defender>"],
    nearMiss: ["<@attacker>'s boomstick nearly blasts <@defender>"],
    onTheNose: ["<@attacker>'s boomstick blasts <@defender>"],
    veryAccurate: ["<@attacker>'s boomstick blasts <@defender> true"],
  },
  equippable: true,
  sellable: true,
  tradeable: true,
})
