import {
  Monster,
  createMonster,
  getRandomMonsterName,
} from '@adventure-bot/monster'
import { asset } from '@adventure-bot/utils'

export function createDemon(): Monster {
  return createMonster({
    kind: 'Demon',
    name: getRandomMonsterName('Demon'),
    hp: 12,
    maxHP: 12,
    ac: 13,
    attackBonus: 2,
    equipment: {
      weapon: {
        name: 'Demon Claws',
        accuracyDescriptors: {
          wideMiss: [
            "<@attacker>'s claws slash in the approximate direction of <@defender>",
          ],
          nearMiss: ["<@attacker>'s claws nearly slash <@defender>"],
          onTheNose: ["<@attacker>'s claws rake <@defender>"],
          veryAccurate: ["<@attacker>'s claws rake <@defender> true"],
        },
        damageMax: 6,
        description: 'the claws of a demon',
        equippable: true,
        goldValue: 0,
        id: 'claws',
        type: 'weapon',
        lootable: false,
        sellable: false,
      },
    },
    asset: asset('fantasy', 'monsters', 'demon').values,
    xpValue: 10,
    gold: Math.floor(Math.random() * 20) + 15,
  })
}
