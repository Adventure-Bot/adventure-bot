import {
  Monster,
  createMonster,
  getRandomMonsterName,
} from '@adventure-bot/game/monster'

export function createFireling(): Monster {
  return createMonster({
    kind: 'Fireling',
    name: getRandomMonsterName('Fireling'),
    hp: 5,
    maxHP: 5,
    ac: 10,
    attackBonus: 15,
    damageMax: 2,
    equipment: {
      weapon: {
        name: 'Fireling Claws',
        accuracyDescriptors: {
          wideMiss: [
            '<@attacker> dashes past you and swipes its claws at <@defender>, but misses',
          ],
          nearMiss: ['<@attacker> barely misses <@defender> with its claws'],
          onTheNose: ["<@attacker>'s claws strike <@defender>"],
          veryAccurate: ["<@attacker>'s claws strike <@defender> true"],
        },
        damageMax: 2,
        description: 'the claws of a Fireling',
        equippable: true,
        goldValue: 0,
        id: 'fireling-claws',
        type: 'weapon',
        lootable: false,
        sellable: false,
      },
    },
    profile:
      'https://static.wikia.nocookie.net/orcsmustdie/images/1/15/Fireling.png/revision/latest?cb=20120904133648',
    xpValue: 10,
    gold: Math.floor(Math.random() * 20) + 15,
  })
}
