import { randomUUID } from 'crypto'

import {
  Monster,
  createMonster,
  getRandomMonsterName,
} from '@adventure-bot/game/monster'
import { asset, d } from '@adventure-bot/game/utils'

export function createGiantCrab(): Monster {
  return createMonster({
    kind: 'Giant Crab',
    hp: 40,
    maxHP: 40,
    attackBonus: 2,
    ac: 20,
    equipment: {
      weapon: {
        name: 'Crab Claw',
        accuracyDescriptors: {
          wideMiss: ['<@attacker> claws clumsily at <@defender>'],
          nearMiss: ['<@attacker> claws at <@defender>'],
          onTheNose: ['<@attacker> claws <@defender>'],
          veryAccurate: [
            "<@attacker>'s claws tear into the flesh of <@defender>",
          ],
        },
        damageMax: 4,
        description: 'Their pinches are unpleaseant',
        equippable: true,
        goldValue: 60,
        id: randomUUID(),
        type: 'weapon',
        lootable: false,
        sellable: false,
      },
    },
    inventory: [
      {
        name: 'Giant Crab Claw',
        description: 'The claw of a deadly giant crab!',
        goldValue: d(100) + 200,
        id: randomUUID(),
        type: 'misc',
        lootable: true,
        sellable: true,
        equippable: false,
        tradeable: true,
      },
    ],

    name: getRandomMonsterName('Giant Crab'),
    profile: asset('fantasy', 'monsters', 'a giant crab in a coral reef').s3Url,
    xpValue: 50,
  })
}
