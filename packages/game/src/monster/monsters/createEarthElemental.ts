import { randomUUID } from 'crypto'

import {
  Monster,
  createMonster,
  getRandomMonsterName,
} from '@adventure-bot/game/monster'
import { asset, d } from '@adventure-bot/game/utils'

export function createEarthElemental(): Monster {
  return createMonster({
    kind: 'Earth Elemental',
    name: getRandomMonsterName('Earth Elemental'),
    hp: 50,
    maxHP: 50,
    ac: 18,
    attackBonus: 2,
    damageMax: 0,
    equipment: {
      weapon: {
        name: 'Earthen Fist',
        accuracyDescriptors: {
          wideMiss: [
            "<@attacker>'s splashes debris in the direction of <@defender>",
          ],
          nearMiss: ['<@attacker> nearly crushes <@defender>'],
          onTheNose: ['<@attacker> crushes <@defender> with a fist of stone'],
          veryAccurate: ['<@attacker> turns <@defender> into rubble'],
        },
        damageMax: 0,
        modifiers: {
          momentum: 1,
        },
        description: 'rock and stone attacks',
        equippable: true,
        goldValue: 1000,
        id: randomUUID(),
        type: 'weapon',
        lootable: true,
        sellable: true,
      },
    },
    profile: asset('fantasy', 'monsters', 'earth elemental').s3Url,
    xpValue: 75,
    gold: 150 + d(100),
  })
}
