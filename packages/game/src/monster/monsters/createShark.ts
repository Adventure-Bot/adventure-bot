import { randomUUID } from 'crypto'

import {
  Monster,
  createMonster,
  getRandomMonsterName,
} from '@adventure-bot/game/monster'
import { asset, d } from '@adventure-bot/game/utils'

export function createShark(): Monster {
  return createMonster({
    kind: 'Shark',
    hp: 18,
    maxHP: 18,
    attackBonus: 6,
    ac: 14,
    equipment: {
      weapon: {
        name: 'Shark Teeth',
        accuracyDescriptors: {
          wideMiss: ['<@attacker> bites clumsily at <@defender>'],
          nearMiss: ['<@attacker> bites at <@defender>'],
          onTheNose: ['<@attacker> bites <@defender>'],
          veryAccurate: [
            "<@attacker>'s teeth sink into the flesh of <@defender>",
          ],
        },
        damageMax: 6,
        description: 'shark bites are unpleaseant',
        equippable: true,
        goldValue: 80,
        id: randomUUID(),
        type: 'weapon',
        lootable: false,
        sellable: false,
      },
    },
    inventory: [
      {
        name: 'Shark Fin',
        description: 'The fin of a deadly shark',
        goldValue: d(20) + 60,
        id: randomUUID(),
        type: 'misc',
        lootable: true,
        sellable: true,
        equippable: false,
        tradeable: true,
      },
    ],
    name: getRandomMonsterName('Shark'),
    profile: asset('fantasy', 'monsters', 'a shark in a coral reef').s3Url,
    xpValue: 20,
  })
}
