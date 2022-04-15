import {
  Monster,
  createMonster,
  getRandomMonsterName,
} from '@adventure-bot/game/monster'
import { asset, d } from '@adventure-bot/game/utils'

export function createDragon(): Monster {
  return createMonster({
    kind: 'Dragon',
    name: getRandomMonsterName('Dragon'),
    hp: 100,
    maxHP: 100,
    ac: 18,
    attackBonus: 5,
    equipment: {
      weapon: {
        name: 'Dragon Attack',
        accuracyDescriptors: {
          wideMiss: [
            '<@attacker> claws in the approximate direction of <@defender>',
            '<@attacker> breathes fire in the approximate direction of <@defender>',
            '<@attacker> bites in the approximate direction of <@defender>',
          ],
          nearMiss: [
            '<@attacker> nearly claws <@defender>',
            "<@attacker>'s fire breath nearly burns <@defender>",
            '<@attacker> nearly bites <@defender>',
          ],
          onTheNose: [
            "<@attacker>'s claws rake <@defender>",
            "<@attacker>'s fire breath catches <@defender>",
            "<@attacker>'s bite catches <@defender>",
          ],
          veryAccurate: [
            "<@attacker>'s claws rake <@defender> true",
            "<@attacker>'s fire breath envelops <@defender>",
            "<@attacker>'s teeth sink into <@defender>",
          ],
        },
        damageMax: 6,
        description: 'the fury of a dragon',
        equippable: true,
        goldValue: 0,
        id: 'dragon-attack',
        type: 'weapon',
        lootable: false,
        sellable: false,
      },
    },
    profile: asset('fantasy', 'monsters', 'dragon').s3Url,
    xpValue: 50,
    gold: d(150) + 300,
  })
}
