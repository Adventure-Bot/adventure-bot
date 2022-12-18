import {
  Monster,
  createMonster,
  getRandomMonsterName,
} from '@adventure-bot/game/monster'
import { asset, d } from '@adventure-bot/game/utils'

export function createPyromancer(): Monster {
  return createMonster({
    kind: 'Pyromancer',
    name: getRandomMonsterName('Pyromancer'),
    hp: 5,
    maxHP: 5,
    equipment: {
      weapon: {
        name: 'Blazing Rod',
        accuracyDescriptors: {
          wideMiss: [
            '<@attacker> launches a fiery orb but <@defender> dodges out of the way',
          ],
          nearMiss: [
            '<@attacker> launches a fiery orb and it nearly struck <@defender>',
          ],
          onTheNose: [
            '<@attacker> launches a fiery orb and it burns <@defender>',
          ],
          veryAccurate: [
            '<@attacker> launches a fiery orb with precision at <@defender>',
          ],
        },
        damageMax: 4,
        modifiers: {
          damageBonus: 1,
        },
        description: 'a staff infused with the power of a volcano',
        equippable: true,
        goldValue: 0,
        id: 'blazing-rod',
        type: 'weapon',
        lootable: false,
        sellable: false,
      },
    },
    profile: asset('fantasy', 'monsters', 'pyromancer').s3Url,
    xpValue: 2,
    gold: d(8) + 6,
  })
}
