import { Monster } from '@adventure-bot/monster/Monster'
import { createMonster } from '@adventure-bot/monster/createMonster'
import { getRandomMonsterName } from '@adventure-bot/monster/names/getRandomMonsterName'
import { getAsset } from '@adventure-bot/utils/getAsset'

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
    asset: getAsset('fantasy', 'monsters', 'dragon').values,
    xpValue: 50,
    gold: Math.floor(Math.random() * 150) + 300,
  })
}
