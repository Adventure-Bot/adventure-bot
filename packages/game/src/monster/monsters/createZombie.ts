import {
  Monster,
  createMonster,
  getRandomMonsterName,
} from '@adventure-bot/game/monster'
import { asset } from '@adventure-bot/game/utils'

export function createZombie(): Monster {
  return createMonster({
    kind: 'Zombie',
    hp: 10,
    attackBonus: -2,
    ac: 8,
    damageMax: 2,
    equipment: {
      weapon: {
        name: 'Zombie Attack',
        accuracyDescriptors: {
          wideMiss: ['<@attacker> claws clumsily at <@defender>'],
          nearMiss: ['<@attacker> grabs ineffectively at <@defender>'],
          onTheNose: ['<@attacker> bites <@defender>'],
          veryAccurate: [
            "<@attacker>'s teeth sink into the flesh of <@defender>!",
          ],
        },
        damageMax: 6,
        description: 'zombie bites are unpleaseant',
        equippable: true,
        goldValue: 0,
        id: 'zombie-attack',
        type: 'weapon',
        lootable: false,
        sellable: false,
      },
    },
    name: getRandomMonsterName('Zombie'),
    profile: asset('fantasy', 'monsters', 'zombie').s3Url,
    gold: Math.floor(Math.random() * 4) + 1,
    xpValue: 1,
  })
}
