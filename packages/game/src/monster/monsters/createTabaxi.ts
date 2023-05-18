import {
  Monster,
  createMonster,
  getRandomMonsterName,
} from '@adventure-bot/game/monster'
import { asset } from '@adventure-bot/game/utils'

export function createTabaxi(): Monster {
  return createMonster({
    kind: 'Tabaxi',
    name: getRandomMonsterName('Tabaxi'),
    hp: 10,
    maxHP: 10,
    ac: 15,
    attackBonus: 3,
    pickpocket: 6,
    equipment: {
      weapon: {
        name: 'Tabaxi Claws',
        accuracyDescriptors: {
          wideMiss: [
            "<@attacker>'s claws slash in the approximate direction of <@defender>",
          ],
          nearMiss: ["<@attacker>'s claws nearly slash <@defender>"],
          onTheNose: ["<@attacker>'s claws rake <@defender>"],
          veryAccurate: ["<@attacker>'s claws rake <@defender> true"],
        },
        damageMax: 4,
        description: 'the claws of a tabaxi',
        equippable: true,
        goldValue: 0,
        id: 'claws',
        type: 'weapon',
        lootable: false,
        sellable: false,
      },
    },
    profile: asset('fantasy', 'monsters', 'tabaxi').s3Url,
    xpValue: 10,
    gold: Math.floor(Math.random() * 20) + 15,
  })
}
